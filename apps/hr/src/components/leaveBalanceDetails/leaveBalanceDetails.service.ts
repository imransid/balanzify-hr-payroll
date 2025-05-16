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

  async newFindAll() {
    const [profileList, leaveBalanceDetails, leaveTypes] = await Promise.all([
      this.prisma.profile.findMany(),
      this.prisma.leaveBalanceDetails.findMany({
        select: {
          leaveBalances: true,
        },
      }),
      this.prisma.leaveType.findMany(),
    ]);

    const leaveTypeMap = leaveTypes.reduce((acc, leaveType) => {
      acc[leaveType.displayName] = "0";
      return acc;
    }, {});

    const createdLeaveData = [];

    // Loop through each profile and insert + collect data
    for (const profile of profileList) {
      const leaveData = {
        EMPCode: profile.id.toString(),
        EMPName: profile.employeeName,
        createdBy: profile.createdBy ?? null,
        ...leaveTypeMap,
      };

      let saveData = await this.prisma.leaveBalanceDetails.create({
        data: {
          createdBy: profile.createdBy ?? null,
          leaveBalances: JSON.stringify(leaveData),
        },
      });

      createdLeaveData.push(saveData); // collect inserted data
    }

    return {
      success: true,
      message: `${createdLeaveData.length} leave balance details created.`,
      data: createdLeaveData,
    };
  }

  async findAll(page = 1, limit = 10, balanceID: number) {
    const skip = (page - 1) * limit;
    return await this.fetchAllData(skip, limit, page, balanceID);
  }

  async fetchAllData(
    skip: number,
    limit: number,
    page: number,
    balanceID: number
  ) {
    // Fetch paginated data
    const [leaveBalanceDetails, totalCount] = await Promise.all([
      this.prisma.leaveBalanceDetails.findMany({
        where: {
          leaveBalanceId: balanceID,
        },
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

  // async updateAllBalanceDetails(balanceID: number, data: string) {
  //   try {
  //     // Parse incoming JSON string
  //     const parsedData = JSON.parse(data);
  //     const updatePromises = parsedData.map(async (item: any) => {
  //       let updatedVal = JSON.stringify(item.leaveBalances);

  //       await this.prisma.leaveBalanceDetails.update({
  //         where: {
  //           id: item.id,
  //         },
  //         data: {
  //           leaveBalanceId: balanceID,
  //           leaveBalances: updatedVal,
  //         },
  //       });
  //     });

  //     return {
  //       success: true,
  //       message: "", //`${results.length} leave balance details updated.`,
  //       data: [], //results,
  //     };
  //   } catch (error) {
  //     console.error("Error updating leaveBalanceDetails:", error);
  //     throw new Error("Failed to update leaveBalanceDetails.");
  //   }
  // }

  async updateAllBalanceDetails(balanceID: number, data: string) {
    try {
      const parsedData = JSON.parse(data);

      console.log(parsedData, "parsedData");

      const updatePromises = parsedData.map(async (item: any) => {
        // Ensure leaveBalances is stored as a JSON string

        const formattedLeaveBalances =
          typeof item.leaveBalances === "string"
            ? item.leaveBalances
            : JSON.stringify(item.leaveBalances);

        await this.prisma.leaveBalanceDetails.update({
          where: {
            id: item.id,
          },
          data: {
            leaveBalanceId: balanceID,
            leaveBalances: formattedLeaveBalances,
            createdBy: item.createdBy ?? null,
            companyId: item.companyId ?? null,
          },
        });
      });

      console.log("updatePromises", updatePromises);

      // Wait for all updates to finish
      const results = await Promise.all(updatePromises);

      return {
        success: true,
        message: `${results.length} leave balance detail(s) updated successfully.`,
        data: results,
      };
    } catch (error) {
      console.error("Error updating leaveBalanceDetails:", error);
      throw new Error("Failed to update leaveBalanceDetails.");
    }
  }
}
