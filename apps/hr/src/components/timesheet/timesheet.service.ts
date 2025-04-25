import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaHrService } from "../../../../../prisma/prisma-hr.service";
import {
  CreateTimeSheetInput,
  UpdateTimeSheetInput,
  TimeSheetsPaginatedResult,
} from "../dto/timesheet.input";
import { TimeSheet } from "../entities/timesheet.entity";

@Injectable()
export class TimeSheetService {
  constructor(private readonly prisma: PrismaHrService) {}

  async create(createTimeSheetInput: CreateTimeSheetInput): Promise<TimeSheet> {
    return this.prisma.timeSheet.create({
      data: createTimeSheetInput,
    });

    // process :
    // 1. holiday  check
    // 2. leave ace kina
    // 3. shift time comple korce kina , over time .. 9 hour to -1 hour to lunch break
    // leave table // shift table
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
