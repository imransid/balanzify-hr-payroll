import { Injectable } from "@nestjs/common";
import { PrismaHrService } from "../../../../../prisma/prisma-hr.service";
import { EmployeePayrollProcess } from "../entities/employeePayroll.entity";
import { PayrollTaxService } from "../payrollTax/payroll-tax.service";
import { FilingStatus } from "../../prisma/OnboardingType.enum";
import { NetPaySummary } from "../entities/taxRate.entity";

@Injectable()
export class EmployeePayrollService {
  constructor(
    private readonly prisma: PrismaHrService,
    private readonly payrollTaxService: PayrollTaxService
  ) {}

  // async getAllEmployeePayroll(
  //   payScheduleId: number
  // ): Promise<EmployeePayrollProcess[]> {
  //   const paySchedule = await this.prisma.paySchedule.findUnique({
  //     where: { id: payScheduleId },
  //   });

  //   if (!paySchedule) {
  //     throw new Error("PaySchedule not found");
  //   }

  //   const allProfile = await this.prisma.profile.findMany({
  //     where: {
  //       profileDetails: {
  //         payScheduleID: payScheduleId,
  //       },
  //     },
  //     include: {
  //       profileDetails: true,
  //       timeSheetProcesses: true,
  //     },
  //   });

  //   if (!allProfile || allProfile.length === 0) {
  //     throw new Error("No profiles found for this PaySchedule ID");
  //   }

  //   const payrollList: EmployeePayrollProcess[] = allProfile.map(
  //     (profile, index) => {
  //       const details = profile.profileDetails;
  //       const timeSheet = profile.timeSheetProcesses;

  //       const { rate, salary, OT, doubleOT, bonus, workingHours } =
  //         this.calculatePayrollFields(details, timeSheet);

  //       let employeeDeduction = 0;
  //       let netPay = this.netPayCalculation(parseInt(salary));
  //       let employeeContribution = 0;

  //       const strArray = profile.profileDetails.deduction_Contribution;

  //       // Convert each string item to a valid JSON object
  //       const parsedArray = strArray.map((item) => {
  //         const validJsonStr = item.replace(/'/g, '"');
  //         return JSON.parse(validJsonStr);
  //       });

  //       if (parsedArray.length > 0) {
  //         const totalCompanyAnnualMax = parsedArray.reduce((sum, item) => {
  //           return sum + Number(item.compnay_annual_max);
  //         }, 0);

  //         const totalEmployeeAnnualMax = parsedArray.reduce((sum, item) => {
  //           return sum + Number(item.employee_annual_max);
  //         }, 0);

  //         employeeContribution = totalCompanyAnnualMax;
  //         employeeDeduction = totalEmployeeAnnualMax;
  //       }

  //       return {
  //         id: index + 1,
  //         employeeName:
  //           `${profile.employeeName} ${profile.middleName || ""} ${profile.lastName || ""}`.trim(),
  //         workingHrs: `${workingHours}`,
  //         Rate: rate,
  //         Salary: salary,
  //         OT,
  //         doubleOT,
  //         PTO: "0", // Placeholder
  //         holydayPay: "0", // Placeholder
  //         bonus,
  //         commission: "0", // Placeholder
  //         total: salary,
  //         grossPay: salary,
  //         profile: profile as any,
  //         paySchedule: paySchedule as any,
  //         createdAt: new Date(),
  //         updatedAt: new Date(),
  //         employeeContribution: employeeContribution,
  //         employeeDeduction: employeeDeduction,
  //         netPaySummary: netPay,
  //       };
  //     }
  //   );

  //   return payrollList;
  // }

  async getAllEmployeePayroll(
    payScheduleId: number
  ): Promise<EmployeePayrollProcess[]> {
    const paySchedule = await this.prisma.paySchedule.findUnique({
      where: { id: payScheduleId },
    });

    if (!paySchedule) {
      throw new Error("PaySchedule not found");
    }

    const allProfile = await this.prisma.profile.findMany({
      where: {
        profileDetails: {
          payScheduleID: payScheduleId,
        },
      },
      include: {
        profileDetails: true,
        timeSheetProcesses: true,
      },
    });

    if (!allProfile || allProfile.length === 0) {
      throw new Error("No profiles found for this PaySchedule ID");
    }

    const payrollList = await Promise.all(
      allProfile.map(async (profile, index) => {
        const details = profile.profileDetails;
        const timeSheet = profile.timeSheetProcesses;

        const { rate, salary, OT, doubleOT, bonus, workingHours } =
          this.calculatePayrollFields(details, timeSheet);

        let employeeDeduction = 0;
        let employeeContribution = 0;

        const netPaySummary = await this.netPaySummaryCalculation(
          parseInt(salary)
        );

        const netPay = await this.netPayCalculation(parseInt(salary));

        const strArray = profile.profileDetails.deduction_Contribution;

        const parsedArray = strArray.map((item) => {
          const validJsonStr = item.replace(/'/g, '"');
          return JSON.parse(validJsonStr);
        });

        if (parsedArray.length > 0) {
          const totalCompanyAnnualMax = parsedArray.reduce((sum, item) => {
            return sum + Number(item.compnay_annual_max);
          }, 0);

          const totalEmployeeAnnualMax = parsedArray.reduce((sum, item) => {
            return sum + Number(item.employee_annual_max);
          }, 0);

          employeeContribution = totalCompanyAnnualMax;
          employeeDeduction = totalEmployeeAnnualMax;
        }

        return {
          id: index + 1,
          employeeName:
            `${profile.employeeName} ${profile.middleName || ""} ${profile.lastName || ""}`.trim(),
          workingHrs: `${workingHours}`,
          Rate: rate,
          Salary: salary,
          OT,
          doubleOT,
          PTO: "0", // Placeholder
          holydayPay: "0", // Placeholder
          bonus,
          commission: "0", // Placeholder
          total: salary,
          grossPay: salary,
          profile: profile as any,
          paySchedule: paySchedule as any,
          createdAt: new Date(),
          updatedAt: new Date(),
          employeeContribution,
          employeeDeduction,
          netPaySummary: netPaySummary,
          netPay: netPay,
        };
      })
    );

    return payrollList;
  }

  private async netPaySummaryCalculation(
    amount: number
  ): Promise<NetPaySummary> {
    let employeeDta = await this.payrollTaxService.taxRate(
      amount * 12,
      FilingStatus.SINGLE
    );

    let employerDta = await this.payrollTaxService.taxRateEmployer(amount * 12);

    return {
      employeeDta,
      employerDta,
    };
  }

  private async netPayCalculation(amount: number) {
    let employeeDta = await this.payrollTaxService.taxRate(
      amount * 12,
      FilingStatus.SINGLE
    );

    let employerDta = await this.payrollTaxService.taxRateEmployer(amount * 12);

    const employeeTotalTax =
      employeeDta.federalTaxWithHoldingYearly +
      employeeDta.medicareTax +
      employeeDta.socialSecurityTax;

    const employerTotalTax =
      employerDta.medicareTax +
      employerDta.socialSecurityTax +
      employerDta.additionalMedicareTax +
      employerDta.futaTax;

    const totalTax = employeeTotalTax + employerTotalTax;

    return amount - totalTax;
  }

  private calculatePayrollFields(
    details: any,
    timeSheet: any
  ): {
    rate: string;
    salary: string;
    OT: string;
    doubleOT: string;
    bonus: string;
    workingHours: number;
  } {
    const ratePerHour = parseFloat(details?.ratePerHour || "0");
    const frequency = (details?.payFrequency || "").toUpperCase();

    const workingHour = timeSheet;

    let workingDays = 5;

    switch (frequency) {
      case "WEEKLY":
        workingDays = 5;
        break;
      case "BIWEEKLY":
        workingDays = 10;
        break;
      case "MONTHLY":
        workingDays = 22;
        break;
      case "SEMIMONTHLY":
        workingDays = 11;
        break;
      default:
        workingDays = 5;
    }

    // Sum total worked time in hours
    let totalWorkedMinutes = 0;

    for (const entry of timeSheet) {
      const totalWorked = entry.totalWorked; // Example: "2h 30m"
      const match = totalWorked.match(/(?:(\d+)h)?\s*(?:(\d+)m)?/);

      if (match) {
        const hours = parseInt(match[1] || "0", 10);
        const minutes = parseInt(match[2] || "0", 10);
        totalWorkedMinutes += hours * 60 + minutes;
      }
    }

    const workingHours = +(totalWorkedMinutes / 60).toFixed(2); // Round to 2 decimal places
    const salary = ratePerHour * workingHours;

    return {
      rate: ratePerHour.toFixed(2),
      salary: salary.toFixed(2),
      OT: details?.overTime ? "Yes" : "No",
      doubleOT: details?.doubleOverTimePay ? "Yes" : "No",
      bonus: details?.bonus ? "Yes" : "No",
      workingHours,
    };
  }
}
