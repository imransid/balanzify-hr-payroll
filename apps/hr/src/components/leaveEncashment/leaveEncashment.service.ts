import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaHrService } from "../../../../../prisma/prisma-hr.service"; // Adjust the import path for your Prisma service
import {
  CreateLeaveEncashmentInput,
  UpdateLeaveEncashmentInput,
} from "../dto/leaveEncashment.input";
import { LeaveEncashment } from "../entities/leaveEncashment.entity"; // Updated for LeaveEncashment
import { LeaveEncashmentInputPaginatedResult } from "../dto/leaveEncashment.input"; // Updated for LeaveEncashment Paginated Result

@Injectable()
export class LeaveEncashmentService {
  constructor(private readonly prisma: PrismaHrService) {}

  // Create a new leave encashment
  async create(
    createLeaveEncashmentInput: CreateLeaveEncashmentInput
  ): Promise<LeaveEncashment> {
    return this.prisma.leaveEncashment.create({
      data: {
        ...createLeaveEncashmentInput,
      },
    });
  }

  // Get a paginated list of leave encashments
  async findAll(
    page = 1,
    limit = 10,
    companyId: string
  ): Promise<LeaveEncashmentInputPaginatedResult> {
    const skip = (page - 1) * limit;

    const [leaveEncashments, totalCount] = await Promise.all([
      this.prisma.leaveEncashment.findMany({
        where: {
          companyId: companyId,
        },
        skip,
        take: limit,
      }) || [], // Ensure it's always an array
      this.prisma.leaveEncashment.count(),
    ]);

    return {
      leaveEncashment: Array.isArray(leaveEncashments) ? leaveEncashments : [], // Safety check
      totalPages: Math.ceil(totalCount / limit),
      currentPage: page,
      totalCount,
    };
  }

  // Get a leave encashment by its ID
  async findOne(id: number): Promise<LeaveEncashment> {
    const leaveEncashment = await this.prisma.leaveEncashment.findUnique({
      where: { id },
    });

    if (!leaveEncashment) {
      throw new NotFoundException(`Leave encashment with ID ${id} not found`);
    }

    return leaveEncashment;
  }

  // Update an existing leave encashment
  async update(
    id: number,
    updateLeaveEncashmentInput: UpdateLeaveEncashmentInput
  ): Promise<LeaveEncashment> {
    await this.findOne(id); // Ensure the leave encashment exists

    const { ...rest } = updateLeaveEncashmentInput;

    return this.prisma.leaveEncashment.update({
      where: { id },
      data: {
        ...rest,
        // Update the relation by resetting and connecting new ones
      },
    });
  }

  // Remove a leave encashment by its ID
  async remove(id: number): Promise<LeaveEncashment> {
    await this.findOne(id); // Ensure the leave encashment exists

    return this.prisma.leaveEncashment.delete({
      where: { id },
    });
  }

  // Search leave encashments based on query (e.g., by employee name or leave period)

  async search(
    query: string,
    companyId: string,
    page = 1,
    limit = 10
  ): Promise<LeaveEncashmentInputPaginatedResult> {
    try {
      const skip = (page - 1) * limit;

      const whereClause: any = {
        companyId: companyId,
      };

      if (query) {
        whereClause.OR = [
          {
            employeeName: {
              contains: query,
              mode: "insensitive",
            },
            leavePeriod: {
              contains: query,
              mode: "insensitive",
            },
          },
        ];
      }

      const [leaveEncashments, totalCount] = await Promise.all([
        this.prisma.leaveEncashment.findMany({
          where: whereClause,

          skip,
          take: limit,
        }),
        this.prisma.leaveEncashment.count({
          where: whereClause,
        }),
      ]);

      return {
        leaveEncashment: leaveEncashments,
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
