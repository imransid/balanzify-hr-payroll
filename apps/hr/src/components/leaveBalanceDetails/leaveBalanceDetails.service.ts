import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaHrService } from "../../../../../prisma/prisma-hr.service";
import {
  CreateLeaveBalanceDetailsInput,
  UpdateLeaveBalanceDetailsInput,
  LeaveBalanceDetailsPaginatedResult,
} from "../dto/leaveBalanceDetails.input";
import {
  LeaveBalanceDetails,
  LeaveBalanceSummary,
  LeaveTypeTotal,
} from "../entities/leave-balance-details.entity";
import { GraphQLException } from "exceptions/graphql-exception";

@Injectable()
export class LeaveBalanceDetailsService {
  constructor(private readonly prisma: PrismaHrService) {}

  async findAll(page = 1, limit = 10) {
    const skip = (page - 1) * limit;

    const [profileList, leaveBalanceDetails, leaveTypes] = await Promise.all([
      this.prisma.profile.findMany(),
      this.prisma.leaveBalanceDetails.findMany({
        select: {
          leaveBalances: true,
        },
      }),
      this.prisma.leaveType.findMany(),
    ]);

    if (
      leaveBalanceDetails.length === 0 ||
      leaveBalanceDetails.length !== profileList.length
    ) {
      const leaveTypeMap = leaveTypes.reduce((acc, leaveType) => {
        acc[leaveType.displayName] = "0";
        return acc;
      }, {});
      // Loop through each profile
      for (const profile of profileList) {
        const leaveData = {
          EMPCode: profile.id.toString(),
          EMPName: profile.employeeName,
          createdBy: profile.createdBy ?? null,
          ...leaveTypeMap,
        };

        const exists = await this.prisma.leaveBalanceDetails.findFirst({
          where: {
            leaveBalances: {
              contains: `"EMPCode":"${leaveData.EMPCode}"`,
            },
          },
        });

        if (!exists) {
          // Create if not exists
          await this.prisma.leaveBalanceDetails.create({
            data: {
              createdBy: profile.createdBy ?? null,
              leaveBalances: JSON.stringify(leaveData),
            },
          });
        } else {
          // Parse existing JSON
          const existingBalances = JSON.parse(exists.leaveBalances);

          // Merge or update existing fields with new data
          const updatedBalances = {
            ...existingBalances,
            ...leaveData,
          };

          // Update the record
          await this.prisma.leaveBalanceDetails.update({
            where: {
              id: exists.id,
            },
            data: {
              leaveBalances: JSON.stringify(updatedBalances),
            },
          });
        }
      }
    }

    return await this.fetchAllData(skip, limit, page);
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

    try {
      const updatedLeaveBalanceDetail =
        await this.prisma.leaveBalanceDetails.update({
          where: { id },
          data: {
            leaveBalances: updateData.data,
          },
        });

      return updatedLeaveBalanceDetail;
    } catch (error) {
      console.error("Update failed:", error); // 👈 LOG THE ACTUAL ERROR
      throw new GraphQLException(
        "Failed to update leave balance detail" + error.toString(),
        "INTERNAL_SERVER_ERROR"
      );
    }

    // return updatedLeaveBalanceDetail;
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

  async totalLeaveTypeAva(): Promise<LeaveBalanceSummary> {
    const leaveBalanceDetails = await this.prisma.leaveBalanceDetails.findMany({
      select: {
        leaveBalances: true,
      },
    });

    const ignoreKeys = ["EMPCode", "EMPName", "createdBy"];
    const totals: Record<string, number> = {};

    for (const detail of leaveBalanceDetails) {
      const balance = JSON.parse(detail.leaveBalances);

      for (const [key, value] of Object.entries(balance)) {
        if (ignoreKeys.includes(key)) continue;

        const numericValue = Number(value);
        if (!isNaN(numericValue)) {
          totals[key] = (totals[key] || 0) + numericValue;
        }
      }
    }

    const data: LeaveTypeTotal[] = Object.entries(totals).map(
      ([type, total]) => ({
        type,
        total,
      })
    );

    return {
      message: "Total Leave Type Summary",
      data,
    };
  }
}
