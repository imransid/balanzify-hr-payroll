import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from "@nestjs/common";
import { PrismaHrService } from "../../../../../prisma/prisma-hr.service";
import {
  CreateTimeSheetProcessInput,
  UpdateTimeSheetProcessInput,
  TimeSheetProcessPaginatedResult,
} from "../dto/create-time-sheet-process.input";
import { TimeSheetProcess } from "../entities/timeSheetProcess.entity";

@Injectable()
export class TimeSheetProcessService {
  constructor(private readonly prisma: PrismaHrService) {}

  async create(input: CreateTimeSheetProcessInput): Promise<TimeSheetProcess> {
    try {
      // 1. Get all timeSheet entries within the process window
      const timeSheets = await this.prisma.timeSheet.findMany({
        where: {
          startTime: {
            gte: input.startProcessTime,
          },
          endTime: {
            lte: input.endProcessTIme,
          },
        },
      });

      if (!timeSheets.length) {
        throw new NotFoundException(
          "No timesheet data found for given time range."
        );
      }

      // 2. Get the status and remark from timeSheets
      const statuses = new Set<string>();
      const remarks: string[] = [];

      timeSheets.forEach((sheet) => {
        if (sheet.status) statuses.add(sheet.status);
        if (sheet.remarks) remarks.push(sheet.remarks);
      });

      // Convert the statuses and remarks to string values
      const status = Array.from(statuses).join(", "); // If multiple statuses, join with commas
      const remark = remarks.join("; "); // Join all remarks with a semicolon

      // 3. Calculate total worked time
      let totalMinutes = 0;
      timeSheets.forEach((sheet) => {
        const start = new Date(sheet.startTime);
        const end = new Date(sheet.endTime);
        const diff = (end.getTime() - start.getTime()) / 1000 / 60; // minutes
        totalMinutes += diff;
      });

      const hours = Math.floor(totalMinutes / 60);
      const minutes = totalMinutes % 60;
      const totalWorked = `${hours}h ${minutes}m`;

      // 4. Create TimeSheetProcess
      return await this.prisma.timeSheetProcess.create({
        data: {
          employeeId: input.profileId.toString(),
          startTime: timeSheets[0].startTime,
          endTime: timeSheets[timeSheets.length - 1].endTime,
          status: status,
          remark: remark,
          totalWorked,
          startProcessTime: input.startProcessTime,
          endProcessTIme: input.endProcessTIme,
          dateType: input.dateType,
          profileId: input.profileId,
          createdBy: input.createdBy || null,
        },
      });
    } catch (error) {
      console.error("Error creating TimeSheetProcess:", error);
      throw new InternalServerErrorException(
        "Failed to create time sheet process"
      );
    }
  }

  async findAll(
    page = 1,
    limit = 10
  ): Promise<TimeSheetProcessPaginatedResult> {
    const skip = (page - 1) * limit;

    const [rawItems, totalCount] = await Promise.all([
      this.prisma.timeSheetProcess.findMany({
        skip,
        take: limit,
        include: {
          profile: {
            include: {
              profileDetails: {
                select: {
                  shift: true,
                },
              },
            },
          },
        },
      }),
      this.prisma.timeSheetProcess.count(),
    ]);

    const items = rawItems.map((item) => ({
      ...item,
      shift: item.profile?.profileDetails?.shift ?? null,
    }));

    return new TimeSheetProcessPaginatedResult(
      items,
      Math.ceil(totalCount / limit),
      page,
      totalCount
    );
  }

  async findOne(id: number): Promise<TimeSheetProcess> {
    const item = await this.prisma.timeSheetProcess.findUnique({
      where: { id },
    });

    if (!item) {
      throw new NotFoundException(`TimeSheetProcess with ID ${id} not found`);
    }

    return item;
  }

  async update(
    id: number,
    input: UpdateTimeSheetProcessInput
  ): Promise<TimeSheetProcess> {
    await this.findOne(id); // Ensure it exists

    try {
      return await this.prisma.timeSheetProcess.update({
        where: { id },
        data: {
          ...input,
        },
      });
    } catch (error) {
      console.error("Error updating TimeSheetProcess:", error);
      throw new InternalServerErrorException(
        "Failed to update time sheet process"
      );
    }
  }

  async remove(id: number): Promise<TimeSheetProcess> {
    await this.findOne(id); // Ensure it exists

    try {
      return await this.prisma.timeSheetProcess.delete({ where: { id } });
    } catch (error) {
      console.error("Error deleting TimeSheetProcess:", error);
      throw new InternalServerErrorException(
        "Failed to delete time sheet process"
      );
    }
  }

  async search(
    query: string,
    page = 1,
    limit = 10
  ): Promise<TimeSheetProcessPaginatedResult> {
    const skip = (page - 1) * limit;

    const [items, totalCount] = await Promise.all([
      this.prisma.timeSheetProcess.findMany({
        where: {
          dateType: { contains: query, mode: "insensitive" },
        },
        skip,
        take: limit,
      }),
      this.prisma.timeSheetProcess.count({
        where: {
          dateType: { contains: query, mode: "insensitive" },
        },
      }),
    ]);

    return new TimeSheetProcessPaginatedResult(
      items,
      Math.ceil(totalCount / limit),
      page,
      totalCount
    );
  }
}
