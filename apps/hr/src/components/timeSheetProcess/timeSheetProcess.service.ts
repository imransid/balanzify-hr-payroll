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

  async create(
    input: CreateTimeSheetProcessInput
  ): Promise<TimeSheetProcess[]> {
    try {
      const profiles = await this.prisma.profile.findMany({
        include: {
          profileDetails: {
            include: {
              shift: true,
            },
          },
        },
      });

      const timeSheetProcesses = await Promise.all(
        profiles.map(async (e) => {
          const timeSheets = await this.prisma.timeSheet.findMany({
            where: {
              employeeId: e.id,
              companyId: input.companyId,
              startTime: {
                gte: new Date(input.startProcessTime),
              },
              endTime: {
                lte: new Date(input.endProcessTIme),
              },
            },
          });

          if (!timeSheets.length) {
            return null; // skip if no timesheets
          }

          // 2. Gather statuses and remarks
          const statuses = new Set<string>();
          const remarks: string[] = [];

          timeSheets.forEach((sheet) => {
            if (sheet.status) statuses.add(sheet.status);
            if (sheet.remarks) remarks.push(sheet.remarks);
          });

          const status = Array.from(statuses).join(", ");
          const remark = remarks.join("; ");

          // 3. Calculate total worked time
          let totalMinutes = 0;
          timeSheets.forEach((sheet) => {
            const start = new Date(sheet.startTime);
            const end = new Date(sheet.endTime);
            const diff = (end.getTime() - start.getTime()) / 1000 / 60;
            totalMinutes += diff;
          });

          const hours = Math.floor(totalMinutes / 60);
          const minutes = totalMinutes % 60;
          const totalWorked = `${hours}h ${minutes}m`;

          // 4. Create TimeSheetProcess

          const created = await this.prisma.timeSheetProcess.create({
            data: {
              employeeId: e.id.toString(),
              startTime: timeSheets[0].startTime,
              endTime: timeSheets[timeSheets.length - 1].endTime,
              status,
              remark,
              totalWorked,
              startProcessTime: input.startProcessTime,
              endProcessTIme: input.endProcessTIme,
              dateType: input.dateType,
              profileId: e.id,
              createdBy: input.createdBy || null,
              companyId: input.companyId,
            },
          });

          // fetch the created TimeSheetProcess with shift
          const fullRecord = await this.prisma.timeSheetProcess.findUnique({
            where: {
              id: created.id,
            },
            include: {
              profile: {
                include: {
                  profileDetails: {
                    include: {
                      shift: true,
                    },
                  },
                },
              },
            },
          });

          // map to match your GraphQL model, attaching shift
          return {
            ...fullRecord,
            shift: fullRecord.profile?.profileDetails?.shift || null,
            profileName: fullRecord.profile.employeeName,
          };
        })
      );

      return timeSheetProcesses.filter(Boolean);
    } catch (error) {
      console.error("Error creating TimeSheetProcess:", error);
      throw new InternalServerErrorException(
        "Failed to create time sheet process"
      );
    }
  }

  async findAll(
    page = 1,
    limit = 10,
    companyId: string
  ): Promise<TimeSheetProcessPaginatedResult> {
    const skip = (page - 1) * limit;

    const [rawItems, totalCount] = await Promise.all([
      this.prisma.timeSheetProcess.findMany({
        skip,
        take: limit,
        where: {
          companyId: companyId,
        },
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
      profileName: item?.profile?.employeeName ?? null,
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
    companyId: string,
    page = 1,
    limit = 10
  ): Promise<TimeSheetProcessPaginatedResult> {
    try {
      const skip = (page - 1) * limit;

      const whereClause: any = {
        companyId: companyId,
      };

      if (query) {
        whereClause.OR = [
          {
            dateType: {
              contains: query,
              mode: "insensitive",
            },
          },
        ];
      }

      const [item, totalCount] = await Promise.all([
        this.prisma.timeSheetProcess.findMany({
          where: whereClause,
          skip,
          take: limit,
        }),
        this.prisma.timeSheetProcess.count({
          where: whereClause,
        }),
      ]);

      return {
        timeSheetProcesses: item,
        totalCount,
        totalPages: Math.ceil(totalCount / limit),
        currentPage: page,
      };
    } catch (error) {
      console.error("🔴 Prisma Search Error:", error); // Add detailed logging
      throw new Error("Failed to search profiles");
    }
  }
}
