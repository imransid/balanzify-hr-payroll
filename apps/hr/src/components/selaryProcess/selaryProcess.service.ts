import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaHrService } from "../../../../../prisma/prisma-hr.service";
import { EmployeePayrollProcess } from "../entities/employeePayroll.entity";
import { PayrollTaxService } from "../payrollTax/payroll-tax.service";
import { FilingStatus } from "../../prisma/OnboardingType.enum";
import { NetPaySummary } from "../entities/taxRate.entity";
import { PaySchedule, profileDetails, timeSheet } from "prisma/generated/hr";

import { calculatePayrollFieldsHelper } from "./helpers/calculate-payroll-fields.helper";
import {
  CreateEmployeePayrollInput,
  EmployeePayrollPaginatedResult,
  UpdateEmployeePayrollInput,
} from "../dto/create-employee-payroll.input";
import { EmployeePayroll } from "../entities/employee-payroll.entity";

@Injectable()
export class EmployeePayrollService {
  constructor(
    private readonly prisma: PrismaHrService,
    private readonly payrollTaxService: PayrollTaxService
  ) {}

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
        profileDetails: {
          include: {
            paySchedule: true,
          },
        },
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

        const {
          rate,
          salary,
          OT,
          doubleOT,
          bonus,
          workingHours,
          grossPay,
          currentProfileHourlySalary,
        } = this.calculatePayrollFields(details, timeSheet);

        let employeeDeduction = 0;
        let employeeContribution = 0;

        const strArray = profile.profileDetails.deduction_Contribution;
        [];

        let parsedArray = [];

        strArray.forEach((item) => {
          try {
            const validJsonStr = item.replace(/'/g, '"');
            const parsed = JSON.parse(validJsonStr);
            parsedArray.push(...parsed);
          } catch (e) {
            console.error("Failed to parse item:", item);
          }
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

        // hour from profile

        const {
          regularHours,
          regularWorkedHours,
          overtimeHours,
          regularSalary,
          overtimePay,
          totalPay,
        } = this.calculateEmployeeSalary(
          currentProfileHourlySalary,
          workingHours,
          details.paySchedule,
          details
        );

        const netPaySummary = await this.netPaySummaryCalculation(totalPay);

        const netPay = await this.netPayCalculation(
          totalPay,
          details.maritalStatus,
          employeeDeduction
        );

        // res from payshedul

        return {
          id: index + 1,
          employeeName:
            `${profile.employeeName} ${profile.middleName || ""} ${profile.lastName || ""}`.trim(),
          workingHrs: `${workingHours}`,
          Rate: rate,
          Salary: regularSalary.toFixed(2).toString(), //salary.toFixed(2),
          OT,
          doubleOT,
          PTO: "0", // Placeholder
          holydayPay: "0", // Placeholder
          bonus,
          commission: "0", // Placeholder
          total: totalPay.toFixed(2).toString(),
          grossPay: totalPay.toFixed(2).toString(),
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
      amount,
      FilingStatus.SINGLE
    );

    let employerDta = await this.payrollTaxService.taxRateEmployer(amount);

    return {
      employeeDta,
      employerDta,
    };
  }

  private async netPayCalculation(
    amount: number,
    filingStatus: string,
    deductions: number
  ) {
    let employeeDta = await this.payrollTaxService.taxRate(
      amount,
      filingStatus === "Married" ? FilingStatus.MARRIED : FilingStatus.SINGLE
    );

    const employeeTotalTax =
      employeeDta.federalTaxWithHoldingYearly +
      employeeDta.medicareTax +
      employeeDta.socialSecurityTax;

    const totalNetPay = employeeTotalTax + deductions;

    return totalNetPay;
  }

  private calculatePayrollFields(
    details: profileDetails,
    timeSheet: any
  ): {
    rate: string;
    salary: string;
    OT: string;
    doubleOT: string;
    bonus: string;
    workingHours: number;
    grossPay: number;
    currentProfileHourlySalary: number;
  } {
    return calculatePayrollFieldsHelper(details, timeSheet);
  }

  private calculateEmployeeSalary(
    hourlyRate: number,
    employeeTotalWorkingHour: number,
    paySchedule: PaySchedule,
    details: profileDetails
  ) {
    const WORKING_HOURS_PER_DAY = 8;
    const OVERTIME_MULTIPLIER = 1.5;

    let workingDays: number;

    switch (paySchedule.payFrequency) {
      case "EVERY_WEEK":
      case "EVERY_ONCE_WEEK":
        workingDays = 5; // Monday to Friday
        break;
      case "TWICE_A_MONTH":
        workingDays = 10; // Roughly 2 working weeks
        break;
      case "EVERY_MONTH":
        workingDays = 22; // Average monthly working days
        break;
      default:
        throw new Error("Unsupported pay frequency");
    }

    const regularHours = workingDays * WORKING_HOURS_PER_DAY;
    const isOvertimeAllowed = details.overTime === true;

    const overtimeHours = isOvertimeAllowed
      ? Math.max(0, employeeTotalWorkingHour - regularHours)
      : 0;

    const regularWorkedHours = employeeTotalWorkingHour - overtimeHours;
    const regularSalary = regularWorkedHours * hourlyRate;
    const overtimePay = overtimeHours * hourlyRate * OVERTIME_MULTIPLIER;
    const totalPay = regularSalary + overtimePay;

    return {
      regularHours,
      regularWorkedHours,
      overtimeHours,
      regularSalary,
      overtimePay,
      totalPay,
    };
  }

  // service

  async create(input: CreateEmployeePayrollInput): Promise<EmployeePayroll> {
    const { netPaySummary, profileId, ...rest } = input;

    return this.prisma.employeePayroll.create({
      data: {
        ...rest,
        profile: profileId ? { connect: { id: profileId } } : undefined,
        netPaySummary: input.netPaySummary,
      },
    });
  }

  async findAll(page = 1, limit = 10): Promise<EmployeePayrollPaginatedResult> {
    const skip = (page - 1) * limit;

    const [employeePayrolls, totalCount] = await Promise.all([
      this.prisma.employeePayroll.findMany({
        skip,
        take: limit,
        orderBy: {
          id: "desc",
        },
      }),
      this.prisma.employeePayroll.count(),
    ]);

    // Map the result to match the GraphQL object shape
    const payrolls = employeePayrolls.map((payroll) => {
      return {
        id: payroll.id,
        employeeName: payroll.employeeName,
        workingHrs: payroll.workingHrs,
        rate: payroll.rate,
        salary: payroll.salary,
        OT: payroll.OT,
        doubleOT: payroll.doubleOT,
        PTO: payroll.PTO,
        holidayPay: payroll.holidayPay,
        bonus: payroll.bonus,
        commission: payroll.commission,
        total: payroll.total,
        grossPay: payroll.grossPay,
        netPay: payroll.netPay,
        employeeContribution: payroll.employeeContribution,
        employeeDeduction: payroll.employeeDeduction,
        netPaySummary: payroll.netPaySummary ? payroll.netPaySummary : null,
        createdAt: payroll.createdAt,
        updatedAt: payroll.updatedAt,
      };
    });

    return {
      payrolls,
      totalCount,
      totalPages: Math.ceil(totalCount / limit),
      currentPage: page,
    };
  }

  async findOne(id: number): Promise<EmployeePayroll> {
    const payroll = await this.prisma.employeePayroll.findUnique({
      where: { id },
    });

    if (!payroll) {
      throw new NotFoundException(`EmployeePayroll with ID ${id} not found`);
    }

    return payroll;
  }

  async update(
    id: number,
    updateEmployeePayrollInput: UpdateEmployeePayrollInput
  ): Promise<EmployeePayroll> {
    const employeePayroll = await this.findOne(id); // Ensure the record exists

    return this.prisma.employeePayroll.update({
      where: { id },
      data: {
        employeeName:
          updateEmployeePayrollInput.employeeName ??
          employeePayroll.employeeName,

        workingHrs:
          updateEmployeePayrollInput.workingHrs ?? employeePayroll.workingHrs,

        rate: updateEmployeePayrollInput.rate ?? employeePayroll.rate,

        salary: updateEmployeePayrollInput.salary ?? employeePayroll.salary,

        OT: updateEmployeePayrollInput.OT ?? employeePayroll.OT,

        doubleOT:
          updateEmployeePayrollInput.doubleOT ?? employeePayroll.doubleOT,

        PTO: updateEmployeePayrollInput.PTO ?? employeePayroll.PTO,

        holidayPay:
          updateEmployeePayrollInput.holidayPay ?? employeePayroll.holidayPay,

        bonus: updateEmployeePayrollInput.bonus ?? employeePayroll.bonus,

        commission:
          updateEmployeePayrollInput.commission ?? employeePayroll.commission,

        total: updateEmployeePayrollInput.total ?? employeePayroll.total,

        grossPay:
          updateEmployeePayrollInput.grossPay ?? employeePayroll.grossPay,

        netPay: updateEmployeePayrollInput.netPay ?? employeePayroll.netPay,

        // Handling profileId as a foreign key relation
        profile: updateEmployeePayrollInput.profileId
          ? { connect: { id: updateEmployeePayrollInput.profileId } }
          : undefined,

        employeeContribution:
          updateEmployeePayrollInput.employeeContribution ??
          employeePayroll.employeeContribution,

        employeeDeduction:
          updateEmployeePayrollInput.employeeDeduction ??
          employeePayroll.employeeDeduction,

        // Handle the nested netPaySummary with Prisma's nested update
        netPaySummary: updateEmployeePayrollInput.netPaySummary
          ? updateEmployeePayrollInput.netPaySummary
          : null,
      },
    });
  }

  async remove(id: number): Promise<EmployeePayroll> {
    await this.findOne(id); // Ensure existence
    return this.prisma.employeePayroll.delete({
      where: { id },
    });
  }

  async search(
    query: string,
    page = 1,
    limit = 10
  ): Promise<EmployeePayrollPaginatedResult> {
    const skip = (page - 1) * limit;

    const [employeePayrolls, totalCount] = await Promise.all([
      this.prisma.employeePayroll.findMany({
        where: {
          OR: [{ employeeName: { contains: query, mode: "insensitive" } }],
        },
        skip,
        take: limit,
        orderBy: {
          id: "desc",
        },
      }),
      this.prisma.employeePayroll.count({
        where: {
          OR: [{ employeeName: { contains: query, mode: "insensitive" } }],
        },
      }),
    ]);

    return {
      payrolls: employeePayrolls,
      totalCount,
      totalPages: Math.ceil(totalCount / limit),
      currentPage: page,
    };
  }
}
