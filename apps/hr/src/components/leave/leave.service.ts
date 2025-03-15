import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaHrService } from '../../../../../prisma/prisma-hr.service';
import {
  CreateLeaveInput,
  LeavePaginatedResult,
  UpdateLeaveInput,
} from '../dto/leave.input';
import { Leave } from '../entities/leave.entity';

@Injectable()
export class LeaveService {
  constructor(private readonly prisma: PrismaHrService) {}

  // Create a new leave
  async create(createLeaveInput: CreateLeaveInput): Promise<Leave> {
    return this.prisma.leave.create({
      data: createLeaveInput,
    });
  }

  // Find all leaves with pagination
  async findAll(page = 1, limit = 10): Promise<LeavePaginatedResult> {
    const skip = (page - 1) * limit;

    const [leaves, totalCount] = await Promise.all([
      this.prisma.leave.findMany({
        skip,
        take: limit,
      }) || [], // Ensure it's always an array
      this.prisma.leave.count(),
    ]);

    return {
      leaves: Array.isArray(leaves) ? leaves : [], // Safety check
      totalPages: Math.ceil(totalCount / limit),
      currentPage: page,
      totalCount,
    };
  }

  // Find a single leave by ID
  async findOne(id: number): Promise<Leave> {
    const leave = await this.prisma.leave.findUnique({ where: { id } });
    if (!leave) {
      throw new NotFoundException(`Leave with ID ${id} not found`);
    }
    return leave;
  }

  // Update an existing leave
  async update(id: number, updateLeaveInput: UpdateLeaveInput): Promise<Leave> {
    await this.findOne(id); // Ensure the leave exists
    return this.prisma.leave.update({
      where: { id },
      data: updateLeaveInput,
    });
  }

  // Remove a leave
  async remove(id: number): Promise<Leave> {
    await this.findOne(id); // Ensure the leave exists
    return this.prisma.leave.delete({
      where: { id },
    });
  }

  // Search leaves by leaveName or leaveType with pagination
  async search(
    query: string,
    page = 1,
    limit = 10,
  ): Promise<LeavePaginatedResult> {
    const skip = (page - 1) * limit;

    const [leaves, totalCount] = await Promise.all([
      this.prisma.leave.findMany({
        where: {
          OR: [
            { leaveName: { contains: query, mode: 'insensitive' } },
            { leaveType: { contains: query, mode: 'insensitive' } },
          ],
        },
        skip,
        take: limit,
      }),
      this.prisma.leave.count({
        where: {
          OR: [
            { leaveName: { contains: query, mode: 'insensitive' } },
            { leaveType: { contains: query, mode: 'insensitive' } },
          ],
        },
      }),
    ]);

    return {
      leaves: leaves, // Ensuring it matches LeavePaginatedResult type
      totalCount, // Matches DTO property
      totalPages: Math.ceil(totalCount / limit),
      currentPage: page,
    };
  }
}
