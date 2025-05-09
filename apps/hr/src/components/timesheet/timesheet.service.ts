import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaHrService } from "../../../../../prisma/prisma-hr.service";
import {
  CreateTimeSheetInput,
  UpdateTimeSheetInput,
  TimeSheetsPaginatedResult,
} from "../dto/timesheet.input";
import { TimeSheet } from "../entities/timesheet.entity";

import { differenceInMinutes, parseISO } from "date-fns";

@Injectable()
export class TimeSheetService {
  constructor(private readonly prisma: PrismaHrService) {}

  async create(createTimeSheetInput: CreateTimeSheetInput): Promise<TimeSheet> {
    const profile = await this.prisma.profile.findUnique({
      where: { id: createTimeSheetInput.employeeId },
      include: {
        profileDetails: {
          include: {
            shift: true,
          },
        },
      },
    });

    if (!profile) {
      throw new NotFoundException(
        `Profile with ID ${createTimeSheetInput.employeeId} not found`
      );
    }

    // const shiftStartTime = profile.profileDetails.shift.shiftIn; // ISO
    // const workingHour = profile.profileDetails.hoursPerDay; // e.g. 8

    // const actualStartTime = createTimeSheetInput.startTime;
    // const actualEndTime = createTimeSheetInput.endTime;

    // // 🕒 Late time in minutes
    // const lateMinutes =
    //   actualStartTime > shiftStartTime
    //     ? differenceInMinutes(actualStartTime, shiftStartTime)
    //     : 0;

    // // ⌛ Total worked time
    // const workedMinutes = differenceInMinutes(actualEndTime, actualStartTime);
    // const expectedMinutes = parseInt(workingHour) * 60;

    // // ⏱️ Overtime in minutes
    // const overtimeMinutes =
    //   workedMinutes > expectedMinutes ? workedMinutes - expectedMinutes : 0;

    // // Debug or save it
    // console.log({
    //   shiftStartTime,
    //   actualStartTime,
    //   lateMinutes,
    //   workedMinutes,
    //   expectedMinutes,
    //   overtimeMinutes,
    // });

    // Extend the model if needed to store late/overtime
    return this.prisma.timeSheet.create({
      data: {
        ...createTimeSheetInput,
        // overtimeMinutes: overtimeMinutes,
        // lateMinutes: lateMinutes,
      },
    });
  }

  async findAll(page = 1, limit = 10): Promise<TimeSheetsPaginatedResult> {
    const skip = (page - 1) * limit;

    const [timeSheets, totalCount] = await Promise.all([
      this.prisma.timeSheet.findMany({
        skip,
        take: limit,
        orderBy: {
          createdAt: "desc",
        },
      }),
      this.prisma.timeSheet.count(),
    ]);

    return {
      timeSheets,
      totalCount,
      totalPages: Math.ceil(totalCount / limit),
      currentPage: page,
    };
  }

  async findOne(id: number): Promise<TimeSheet> {
    const timeSheet = await this.prisma.timeSheet.findUnique({
      where: { id },
    });

    if (!timeSheet) {
      throw new NotFoundException(`Time sheet with ID ${id} not found`);
    }

    return timeSheet;
  }

  async update(
    id: number,
    updateTimeSheetInput: UpdateTimeSheetInput
  ): Promise<TimeSheet> {
    await this.findOne(id); // ensures the record exists
    return this.prisma.timeSheet.update({
      where: { id },
      data: updateTimeSheetInput,
    });
  }

  async remove(id: number): Promise<TimeSheet> {
    await this.findOne(id); // ensures the record exists
    return this.prisma.timeSheet.delete({
      where: { id },
    });
  }

  async search(
    query: string,
    page = 1,
    limit = 10
  ): Promise<TimeSheetsPaginatedResult> {
    const skip = (page - 1) * limit;

    const numericQuery = Number(query);
    const isNumeric = !isNaN(numericQuery);

    const whereClause = isNumeric ? { employeeId: numericQuery } : {}; // optionally expand with relation fields if needed

    const [timeSheets, totalCount] = await Promise.all([
      this.prisma.timeSheet.findMany({
        where: whereClause,
        skip,
        take: limit,
        orderBy: {
          createdAt: "desc", // or whatever valid field
        },
      }),
      this.prisma.timeSheet.count({
        where: whereClause,
      }),
    ]);

    return {
      timeSheets,
      totalCount,
      totalPages: Math.ceil(totalCount / limit),
      currentPage: page,
    };
  }
}
