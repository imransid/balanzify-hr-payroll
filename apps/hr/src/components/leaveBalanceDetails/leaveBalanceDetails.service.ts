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

    // Fetch profiles, existing leave balance details, and leave types
    const [profileList, detailsList, leaveTypes] = await Promise.all([
      this.prisma.profile.findMany(),
      this.prisma.leaveBalanceDetails.findMany(),
      this.prisma.leaveType.findMany(),
    ]);

    // Map leave types to key names with "0"
    const leaveTypeMap = leaveTypes.reduce((acc, leaveType) => {
      acc[leaveType.displayName] = "0";
      return acc;
    }, {});

    // Seed leaveBalanceDetails if empty
    if (profileList.length > 0 && detailsList.length === 0) {
      const createInputs = profileList.map((profile) => ({
        EMPCode: profile.id.toString(),
        EMPName: profile.employeeName,
        createdBy: profile.createdBy ?? null,
        ...leaveTypeMap,
      }));

      console.log("createInputs >>", createInputs);

      await this.prisma.leaveBalanceDetails.createMany({
        data: createInputs,
      });
    }

    // Fetch paginated data
    const [leaveBalanceDetails, totalCount] = await Promise.all([
      this.prisma.leaveBalanceDetails.findMany({
        skip,
        take: limit,
        // orderBy: { createdAt: "desc" },
      }),
      this.prisma.leaveBalanceDetails.count(),
    ]);

    console.log("leaveBalanceDetails", leaveBalanceDetails);

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
