import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaHrService } from "../../../../../prisma/prisma-hr.service";
import {
  CreateLeaveTypeInput,
  LeaveTypePaginatedResult,
  UpdateLeaveTypeInput,
} from "../dto/leaveType.input";
import { LeaveType } from "../entities/leaveType.entity";

@Injectable()
export class LeaveTypeService {
  constructor(private readonly prisma: PrismaHrService) {}

  async create(createLeaveTypeInput: CreateLeaveTypeInput): Promise<LeaveType> {
    return this.prisma.leaveType.create({
      data: createLeaveTypeInput,
    });
  }

  async findAll(
    page = 1,
    limit = 10,
    companyId: string
  ): Promise<LeaveTypePaginatedResult> {
    const skip = (page - 1) * limit;

    const [leaveTypes, totalCount] = await Promise.all([
      this.prisma.leaveType.findMany({
        where: {
          companyId: companyId,
        },
        skip,
        take: limit,
      }) || [],
      this.prisma.leaveType.count(),
    ]);

    return {
      leaveTypes: Array.isArray(leaveTypes) ? leaveTypes : [],
      totalPages: Math.ceil(totalCount / limit),
      currentPage: page,
      totalCount,
    };
  }

  async findOne(id: number): Promise<LeaveType> {
    const leaveType = await this.prisma.leaveType.findUnique({ where: { id } });
    if (!leaveType) {
      throw new NotFoundException(`LeaveType with ID ${id} not found`);
    }
    return leaveType;
  }

  async update(
    id: number,
    updateLeaveTypeInput: UpdateLeaveTypeInput
  ): Promise<LeaveType> {
    await this.findOne(id); // Ensure it exists
    return this.prisma.leaveType.update({
      where: { id },
      data: updateLeaveTypeInput,
    });
  }

  async remove(id: number): Promise<LeaveType> {
    await this.findOne(id); // Ensure it exists
    return this.prisma.leaveType.delete({
      where: { id },
    });
  }

  async search(
    query: string,
    companyId: string,
    page = 1,
    limit = 10
  ): Promise<LeaveTypePaginatedResult> {
    try {
      const skip = (page - 1) * limit;

      const whereClause: any = {
        companyId: companyId,
      };

      if (query) {
        whereClause.OR = [
          {
            leaveName: {
              contains: query,
              mode: "insensitive",
            },
          },
        ];
      }

      const [leaveTypes, totalCount] = await Promise.all([
        this.prisma.leaveType.findMany({
          where: whereClause,

          skip,
          take: limit,
        }),
        this.prisma.leaveType.count({
          where: whereClause,
        }),
      ]);

      return {
        leaveTypes,
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
