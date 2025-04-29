import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaHrService } from "../../../../../prisma/prisma-hr.service";
import {
  CreateLeaveBalanceInput,
  UpdateLeaveBalanceInput,
  LeaveBalancePaginatedResult,
} from "../dto/leaveBalance.input";
import { LeaveBalance } from "../entities/leaveBalance.entity";

@Injectable()
export class LeaveBalanceService {
  constructor(private readonly prisma: PrismaHrService) {}

  async create(
    createLeaveBalanceInput: CreateLeaveBalanceInput
  ): Promise<LeaveBalance> {
    return this.prisma.leaveBalance.create({
      data: createLeaveBalanceInput,
    });
  }

  async findAll(page = 1, limit = 10): Promise<LeaveBalancePaginatedResult> {
    const skip = (page - 1) * limit;

    const [leaveBalances, totalCount] = await Promise.all([
      this.prisma.leaveBalance.findMany({
        skip,
        take: limit,
        orderBy: {
          createdAt: "desc",
        },
      }),
      this.prisma.leaveBalance.count(),
    ]);

    return {
      leaveBalances,
      totalPages: Math.ceil(totalCount / limit),
      currentPage: page,
      totalCount,
    };
  }

  async findOne(id: number): Promise<LeaveBalance> {
    const leaveBalance = await this.prisma.leaveBalance.findUnique({
      where: { id },
    });

    if (!leaveBalance) {
      throw new NotFoundException(`Leave balance with ID ${id} not found`);
    }

    return leaveBalance;
  }

  async update(
    id: number,
    updateLeaveBalanceInput: UpdateLeaveBalanceInput
  ): Promise<LeaveBalance> {
    await this.findOne(id); // ensure it exists first
    return this.prisma.leaveBalance.update({
      where: { id },
      data: updateLeaveBalanceInput,
    });
  }

  async remove(id: number): Promise<LeaveBalance> {
    await this.findOne(id); // ensure it exists first
    return this.prisma.leaveBalance.delete({
      where: { id },
    });
  }

  async search(
    query: string,
    page = 1,
    limit = 10
  ): Promise<LeaveBalancePaginatedResult> {
    const skip = (page - 1) * limit;

    const [leaveBalances, totalCount] = await Promise.all([
      this.prisma.leaveBalance.findMany({
        where: {
          title: { contains: query, mode: "insensitive" },
        },
        skip,
        take: limit,
        orderBy: {
          createdAt: "desc",
        },
      }),
      this.prisma.leaveBalance.count({
        where: {
          title: { contains: query, mode: "insensitive" },
        },
      }),
    ]);

    return {
      leaveBalances,
      totalCount,
      totalPages: Math.ceil(totalCount / limit),
      currentPage: page,
    };
  }
}
