import { Injectable } from "@nestjs/common";
import { PrismaHrService } from "../../../../../prisma/prisma-hr.service";
import { EmployeePayrollProcess } from "../entities/employeePayroll.entity";

@Injectable()
export class EmployeePayrollService {
  constructor(private readonly prisma: PrismaHrService) {}

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

    const payrollList: EmployeePayrollProcess[] = allProfile.map(
      (profile, index) => {
        const details = profile.profileDetails;
        const timeSheet = profile.timeSheetProcesses;

        const { rate, salary, OT, doubleOT, bonus, workingHours } =
          this.calculatePayrollFields(details, timeSheet);

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
        };
      }
    );

    return payrollList;
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
