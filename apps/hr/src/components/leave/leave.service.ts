import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaHrService } from "../../../../../prisma/prisma-hr.service";
import {
  CreateEmployeeLeaveInput,
  LeavePaginatedResult,
  UpdateEmployeeLeaveInput,
} from "../dto/leave.input";
import { EmployeeLeave } from "../entities/leave.entity";
import { LeaveBalanceDetailsService } from "../leaveBalanceDetails/leaveBalanceDetails.service";

@Injectable()
export class LeaveService {
  constructor(
    private readonly prisma: PrismaHrService,
    private readonly leaveBalanceDetailsService: LeaveBalanceDetailsService
  ) {}

  // Create a new leave
  async create(
    createLeaveInput: CreateEmployeeLeaveInput
  ): Promise<EmployeeLeave> {
    return this.prisma.employeeLeave.create({
      data: createLeaveInput,
    });
  }

  // Find all leaves with pagination
  async findAll(page = 1, limit = 10): Promise<LeavePaginatedResult> {
    const skip = (page - 1) * limit;

    const [leaves, totalCount] = await Promise.all([
      this.prisma.EmployeeLeave.findMany({
        skip,
        take: limit,
      }) || [], // Ensure it's always an array
      this.prisma.EmployeeLeave.count(),
    ]);

    return {
      leaves: Array.isArray(leaves) ? leaves : [], // Safety check
      totalPages: Math.ceil(totalCount / limit),
      currentPage: page,
      totalCount,
    };
  }

  // Find a single leave by ID
  async findOne(id: number): Promise<EmployeeLeave> {
    const leave = await this.prisma.EmployeeLeave.findUnique({ where: { id } });
    if (!leave) {
      throw new NotFoundException(`Leave with ID ${id} not found`);
    }
    return leave;
  }

  // Update an existing leave
  async update(
    id: number,
    updateLeaveInput: UpdateEmployeeLeaveInput
  ): Promise<EmployeeLeave> {
    // 1. Find existing leave entry
    const employeeLeave = await this.findOne(id);

    // 2. Get leave type info (e.g., "Annual")
    const leaveType = await this.prisma.leaveType.findUnique({
      where: { id: employeeLeave.leaveTypeId },
    });

    if (!leaveType || !leaveType.displayName) {
      throw new Error("Leave type not found or missing display name.");
    }

    // 3. Get all leave balance details
    const leaveBalanceDetails =
      await this.prisma.leaveBalanceDetails.findMany();

    // 4. Match employee's leave balance record
    const target = leaveBalanceDetails.find((item) => {
      const parsed = JSON.parse(item.leaveBalances);
      return parsed.EMPCode === employeeLeave.profileId.toString();
    });

    if (target) {
      const parsedBalances = JSON.parse(target.leaveBalances);

      const currentBalance = parseFloat(
        parsedBalances[leaveType.displayName] || "0"
      );
      const updatedBalance = currentBalance - employeeLeave.totalDays;

      parsedBalances[leaveType.displayName] = updatedBalance.toString();

      // 5. Update leave balance record
      await this.prisma.leaveBalanceDetails.update({
        where: { id: target.id },
        data: {
          leaveBalances: JSON.stringify(parsedBalances),
        },
      });
    }

    // 6. Update employee leave info
    return this.prisma.employeeLeave.update({
      where: { id },
      data: updateLeaveInput,
    });
  }
}
