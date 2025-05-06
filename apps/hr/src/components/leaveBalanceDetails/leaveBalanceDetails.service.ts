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

  async findAll(page = 1, limit = 10) {
    const skip = (page - 1) * limit;

    const [profileList, , leaveTypes] = await Promise.all([
      this.prisma.profile.findMany(),
      this.prisma.leaveBalanceDetails.findMany(),
      this.prisma.leaveType.findMany(),
    ]);

    const leaveTypeMap = leaveTypes.reduce((acc, leaveType) => {
      acc[leaveType.displayName] = "0";
      return acc;
    }, {});

    if (profileList.length < 1) {
      return this.fetchAllData(skip, limit, page);
    }

    // Loop through each profile
    for (const profile of profileList) {
      const leaveData = {
        EMPCode: profile.id.toString(),
        EMPName: profile.employeeName,
        createdBy: profile.createdBy ?? null,
        ...leaveTypeMap,
      };

      // Check if this EMPCode already exists in the `data` JSON string
      const exists = await this.prisma.leaveBalanceDetails.findFirst({
        where: {
          leaveBalances: {
            contains: `"EMPCode":"${leaveData.EMPCode}"`, // crude check inside stringified JSON
          },
        },
      });

      // Only insert if not exists
      if (!exists) {
        await this.prisma.leaveBalanceDetails.create({
          data: {
            createdBy: profile.createdBy ?? null,
            leaveBalances: JSON.stringify(leaveData),
          },
        });
      }
    }

    return this.fetchAllData(skip, limit, page);
  }

  async fetchAllData(skip: number, limit: number, page: number) {
    // Fetch paginated data
    const [leaveBalanceDetails, totalCount] = await Promise.all([
      this.prisma.leaveBalanceDetails.findMany({
        skip,
        take: limit,
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

  async update(
    id: number,
    updateData: UpdateLeaveBalanceDetailsInput
  ): Promise<LeaveBalanceDetails> {
    const leaveBalanceDetail = await this.prisma.leaveBalanceDetails.findUnique(
      {
        where: { id },
      }
    );

    if (!leaveBalanceDetail) {
      throw new NotFoundException(
        `Leave Balance Detail with ID ${id} not found`
      );
    }

    const updatedLeaveBalanceDetail =
      await this.prisma.leaveBalanceDetails.update({
        where: { id },
        data: updateData,
      });

    console.log(`Leave Balance Detail with ID ${id} has been updated`);

    return updatedLeaveBalanceDetail;
  }

  async remove(id: number) {
    const leaveBalanceDetail = await this.prisma.leaveBalanceDetails.findUnique(
      {
        where: { id },
      }
    );

    if (!leaveBalanceDetail) {
      throw new NotFoundException(
        `Leave Balance Detail with ID ${id} not found`
      );
    }

    return await this.prisma.leaveBalanceDetails.delete({
      where: { id },
    });
  }
}
