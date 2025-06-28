import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaHrService } from "../../../../../prisma/prisma-hr.service"; // Adjust the import path for your Prisma service
import {
  CreatePayScheduleInput,
  UpdatePayScheduleInput,
  PaySchedulePaginatedResult,
} from "../dto/paySchedule.input";
import { PaySchedule } from "../entities/paySchedule.entity";

@Injectable()
export class PayScheduleService {
  constructor(private readonly prisma: PrismaHrService) {}

  // Create a new pay schedule
  async create(
    createPayScheduleInput: CreatePayScheduleInput
  ): Promise<PaySchedule> {
    return this.prisma.paySchedule.create({
      data: createPayScheduleInput,
    });
  }

  // Get a paginated list of pay schedules
  async findAll(
    page = 1,
    limit = 1,
    companyID?: string // Made optional
  ): Promise<PaySchedulePaginatedResult> {
    const skip = (page - 1) * limit;

    const whereClause = companyID ? { companyID } : {}; // Conditionally filter by companyID

    const [paySchedules, totalCount] = await Promise.all([
      this.prisma.paySchedule.findMany({
        where: whereClause,
        skip,
        take: limit,
      }) || [],
      this.prisma.paySchedule.count({
        where: whereClause,
      }),
    ]);

    return {
      paySchedules: Array.isArray(paySchedules) ? paySchedules : [],
      totalPages: Math.ceil(totalCount / limit),
      currentPage: page,
      totalCount,
    };
  }

  // Get a pay schedule by its ID
  async findOne(id: number): Promise<PaySchedule> {
    const paySchedule = await this.prisma.paySchedule.findUnique({
      where: { id },
    });
    if (!paySchedule) {
      throw new NotFoundException(`Pay schedule with ID ${id} not found`);
    }
    return paySchedule;
  }

  // Update an existing pay schedule
  async update(
    id: number,
    updatePayScheduleInput: UpdatePayScheduleInput
  ): Promise<PaySchedule> {
    await this.findOne(id);
    return this.prisma.paySchedule.update({
      where: { id },
      data: updatePayScheduleInput,
    });
  }

  // Remove a pay schedule by its ID
  async remove(id: number): Promise<PaySchedule> {
    await this.findOne(id);
    return this.prisma.paySchedule.delete({
      where: { id },
    });
  }

  async search(
    query: string,
    companyId: string,
    page = 1,
    limit = 10
  ): Promise<PaySchedulePaginatedResult> {
    try {
      const skip = (page - 1) * limit;

      const whereClause: any = {
        companyID: companyId,
      };

      if (query) {
        whereClause.OR = [
          {
            payScheduleName: {
              contains: query,
              mode: "insensitive",
            },
          },
        ];
      }

      const [paySchedules, totalCount] = await Promise.all([
        this.prisma.paySchedule.findMany({
          where: whereClause,

          skip,
          take: limit,
        }),
        this.prisma.paySchedule.count({
          where: whereClause,
        }),
      ]);

      return {
        paySchedules,
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
