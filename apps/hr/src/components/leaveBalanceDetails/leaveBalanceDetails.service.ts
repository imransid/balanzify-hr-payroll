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

  async findOne(id: number): Promise<LeaveBalanceDetails> {
    const leaveBalanceDetail = await this.prisma.leaveBalanceDetails.findUnique(
      {
        where: { id },
      }
    );

    return leaveBalanceDetail;
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
    updateData: UpdateLeaveBalanceDetailsInput,
    autoCreation: boolean = false
  ): Promise<LeaveBalanceDetails> {
    const leaveBalanceDetail = await this.prisma.leaveBalanceDetails.findUnique(
      {
        where: { id },
      }
    );

    if (!leaveBalanceDetail && autoCreation === false) {
      throw new NotFoundException(
        `Leave Balance Detail with ID ${id} not found`
      );
    }

    if (autoCreation && !leaveBalanceDetail) {
      return await this.prisma.leaveBalanceDetails.create({
        data: {
          leaveBalanceId: updateData.leaveBalanceId,
          leaveBalances: updateData.data,
        },
      });
    }

    try {
      const updatedLeaveBalanceDetail =
        await this.prisma.leaveBalanceDetails.update({
          where: { id },
          data: {
            leaveBalances: updateData.data,
            leaveBalance: updateData.leaveBalanceId
              ? {
                  connect: { id: updateData.leaveBalanceId },
                }
              : undefined,
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

  async totalLeaveTypeAva(companyId: string) {
    const leaveType = await this.prisma.leaveType.findMany({
      where: {
        companyId: companyId,
      },
      select: {
        displayName: true,
      },
    });

    const leaveBalanceDetails = await this.prisma.leaveBalanceDetails.findMany({
      select: {
        leaveBalances: true,
      },
    });

    // Step 1: Extract leave types
    const leaveTypes = leaveType.map((type) => type.displayName);

    // Step 2: Initialize data structure
    const returnRes: Record<
      string,
      { available: number; pending: number; reject: number; approve: number }
    > = {};
    leaveTypes.forEach((type) => {
      returnRes[type] = { available: 0, pending: 0, reject: 0, approve: 0 };
    });

    const employeeLeave = await this.prisma.employeeLeave.findMany({
      include: {
        leaveTypeData: true,
      },
    });

    employeeLeave.forEach((leave) => {
      const type = leave.leaveTypeData.displayName; // e.g., 'SHORT', 'ANNUAL'
      const status = leave.status; // e.g., 'APPROVE', 'PENDING'

      // Check if this type exists in returnRes
      if (returnRes[type]) {
        if (status === "APPROVE") {
          returnRes[type].approve += 1;
        } else if (status === "PENDING") {
          returnRes[type].pending += 1;
        } else if (status === "REJECT") {
          returnRes[type].reject += 1;
        }
      }
    });

    // Step 3: Loop and parse leave balances
    for (const detail of leaveBalanceDetails) {
      const balances = JSON.parse(detail.leaveBalances);

      console.log("balances", balances);

      leaveTypes.forEach((type) => {
        const leaveValue = parseInt(balances[type], 10); // Convert from string to number
        // check
        if (!isNaN(leaveValue)) {
          returnRes[type].available += leaveValue;
        }
      });
    }

    console.log(returnRes);

    return {
      message: "Total Leave Type Summary",
      data: returnRes,
    };
  }

  async updateAllBalanceDetails(balanceID: number, data: string) {
    try {
      const parsedData = JSON.parse(data);

      console.log("parsedData", parsedData);

      const updatePromises = await parsedData.map(async (item: any) => {
        item.leaveBalanceId = balanceID;
        item.data = item.leaveBalances;

        return await this.update(item.id, item, true);
      });

      console.log("updatePromises", updatePromises);

      // Wait for all updates to finish
      const results = await Promise.all(updatePromises);

      return {
        success: true,
        message: ` leave balance detail(s) updated successfully.`,
        data: results,
      };
    } catch (error) {
      console.error("Error updating leaveBalanceDetails:", error);
      throw new Error("Failed to update leaveBalanceDetails.");
    }
  }
}
