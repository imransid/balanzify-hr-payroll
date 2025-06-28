import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaHrService } from "../../../../../prisma/prisma-hr.service";
import {
  CreateLeaveBalanceInput,
  UpdateLeaveBalanceInput,
  LeaveBalancePaginatedResult,
} from "../dto/leaveBalance.input";
import { LeaveBalance } from "../entities/leaveBalance.entity";
//companyId
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

  async findAll(
    page = 1,
    limit = 10,
    companyId: string
  ): Promise<LeaveBalancePaginatedResult> {
    const skip = (page - 1) * limit;

    const [leaveBalances, totalCount] = await Promise.all([
      this.prisma.leaveBalance.findMany({
        skip,
        where: {
          companyId: companyId,
        },
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
    companyId: string,
    page = 1,
    limit = 10
  ): Promise<LeaveBalancePaginatedResult> {
    try {
      const skip = (page - 1) * limit;

      const whereClause: any = {
        companyId: companyId,
      };

      if (query) {
        whereClause.OR = [
          {
            title: {
              contains: query,
              mode: "insensitive",
            },
          },
        ];
      }

      const [leaveBalances, totalCount] = await Promise.all([
        this.prisma.leaveBalance.findMany({
          where: whereClause,

          skip,
          take: limit,
        }),
        this.prisma.leaveBalance.count({
          where: whereClause,
        }),
      ]);

      return {
        leaveBalances,
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
