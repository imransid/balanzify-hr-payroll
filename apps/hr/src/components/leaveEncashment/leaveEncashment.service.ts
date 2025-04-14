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
      data: createLeaveEncashmentInput, // Use the input data for creating LeaveEncashment
    });
  }

  // Get a paginated list of leave encashments
  async findAll(
    page = 1,
    limit = 10
  ): Promise<LeaveEncashmentInputPaginatedResult> {
    const skip = (page - 1) * limit;

    const [leaveEncashments, totalCount] = await Promise.all([
      this.prisma.leaveEncashment.findMany({
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
    return this.prisma.leaveEncashment.update({
      where: { id },
      data: updateLeaveEncashmentInput,
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
    page = 1,
    limit = 10
  ): Promise<LeaveEncashmentInputPaginatedResult> {
    const skip = (page - 1) * limit;

    const [leaveEncashments, totalCount] = await Promise.all([
      this.prisma.leaveEncashment.findMany({
        where: {
          employeeName: { contains: query, mode: "insensitive" }, // Case-insensitive search by employee name
        },
        skip,
        take: limit,
      }),
      this.prisma.leaveEncashment.count({
        where: {
          employeeName: { contains: query, mode: "insensitive" },
        },
      }),
    ]);

    return {
      leaveEncashment: leaveEncashments, // Ensure it matches LeaveEncashment type
      totalCount,
      totalPages: Math.ceil(totalCount / limit),
      currentPage: page,
    };
  }
}
