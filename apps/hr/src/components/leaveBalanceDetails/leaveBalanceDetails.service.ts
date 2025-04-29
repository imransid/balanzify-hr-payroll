import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaHrService } from "../../../../../prisma/prisma-hr.service";
import {
  CreateLeaveBalanceDetailsInput,
  UpdateLeaveBalanceDetailsInput,
  LeaveBalanceDetailsPaginatedResult,
} from "../dto/leaveBalanceDetails.input";
import { LeaveBalanceDetails } from "../entities/leave-balance-details.entity";

@Injectable()
export class LeaveBalanceDetailsService {
  constructor(private readonly prisma: PrismaHrService) {}

  async findAll(
    page = 1,
    limit = 10
  ): Promise<LeaveBalanceDetailsPaginatedResult> {
    const skip = (page - 1) * limit;

    // Fetch profiles and existing leave balance details
    const [profileList, detailsList] = await Promise.all([
      this.prisma.profile.findMany(),
      this.prisma.leaveBalanceDetails.findMany(),
    ]);

    // Seed leaveBalanceDetails if empty and profileList exists
    if (profileList.length > 0 && detailsList.length === 0) {
      const createInputs = profileList.map((profile) => ({
        EMPCode: profile.id.toString(),
        EMPName: profile.employeeName,
        createdBy: profile.createdBy ?? null,
        Sick: "0",
        Casual: "0",
        Earn: "0",
        LWP: "0",
        PL: "0",
        CO: "0",
        ShortL: "0",
      }));

      await this.prisma.leaveBalanceDetails.createMany({
        data: createInputs,
      });
    }

    // Fetch paginated result after seeding
    const [leaveBalanceDetails, totalCount] = await Promise.all([
      this.prisma.leaveBalanceDetails.findMany({
        skip,
        take: limit,
        orderBy: {
          createdAt: "desc",
        },
        include: {
          leaveBalance: true,
        },
      }),
      this.prisma.leaveBalanceDetails.count(),
    ]);

    return {
      leaveBalanceDetails,
      totalCount,
      totalPages: Math.ceil(totalCount / limit),
      currentPage: page,
    };
  }

  async findOne(id: number): Promise<LeaveBalanceDetails> {
    const details = await this.prisma.leaveBalanceDetails.findUnique({
      where: { id },
      include: { leaveBalance: true },
    });

    if (!details) {
      throw new NotFoundException(
        `Leave balance details with ID ${id} not found`
      );
    }

    return details;
  }

  async update(
    id: number,
    updateInput: UpdateLeaveBalanceDetailsInput
  ): Promise<LeaveBalanceDetails> {
    await this.findOne(id); // check if exists
    return this.prisma.leaveBalanceDetails.update({
      where: { id },
      data: updateInput,
      include: { leaveBalance: true },
    });
  }

  async remove(id: number): Promise<LeaveBalanceDetails> {
    await this.findOne(id); // check if exists
    return this.prisma.leaveBalanceDetails.delete({
      where: { id },
      include: { leaveBalance: true },
    });
  }

  async search(
    query: string,
    page = 1,
    limit = 10
  ): Promise<LeaveBalanceDetailsPaginatedResult> {
    const skip = (page - 1) * limit;

    const [leaveBalanceDetails, totalCount] = await Promise.all([
      this.prisma.leaveBalanceDetails.findMany({
        where: {
          EMPName: { contains: query, mode: "insensitive" },
        },
        skip,
        take: limit,
        orderBy: {
          createdAt: "desc",
        },
        include: { leaveBalance: true },
      }),
      this.prisma.leaveBalanceDetails.count({
        where: {
          EMPName: { contains: query, mode: "insensitive" },
        },
      }),
    ]);

    return {
      leaveBalanceDetails,
      totalCount,
      totalPages: Math.ceil(totalCount / limit),
      currentPage: page,
    };
  }
}
