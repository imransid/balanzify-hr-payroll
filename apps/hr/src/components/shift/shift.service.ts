import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaHrService } from "../../../../../prisma/prisma-hr.service"; // Adjust the import path for your Prisma service
import {
  CreateShiftInput,
  UpdateShiftInput,
  ShiftPaginatedResult,
} from "../dto/shift.input";
import { Shift } from "../entities/shift.entity";

@Injectable()
export class ShiftService {
  constructor(private readonly prisma: PrismaHrService) {}

  // Create a new shift
  async create(createShiftInput: CreateShiftInput): Promise<Shift> {
    return this.prisma.shift.create({
      data: createShiftInput,
    });
  }

  // Get a paginated list of shifts
  async findAll(
    page = 1,
    limit = 10,
    companyId: string
  ): Promise<ShiftPaginatedResult> {
    const skip = (page - 1) * limit;

    const [shifts, totalCount] = await Promise.all([
      this.prisma.shift.findMany({
        skip,
        take: limit,
        where: {
          companyId: companyId,
        },
      }) || [], // Ensure it's always an array
      this.prisma.shift.count({
        where: {
          companyId: companyId,
        },
      }),
    ]);

    return {
      shifts: Array.isArray(shifts) ? shifts : [], // Safety check
      totalPages: Math.ceil(totalCount / limit),
      currentPage: page,
      totalCount,
    };
  }

  // Get a shift by its ID
  async findOne(id: number): Promise<Shift> {
    const shift = await this.prisma.shift.findUnique({
      where: { id },
    });
    if (!shift) {
      throw new NotFoundException(`Shift with ID ${id} not found`);
    }
    return shift;
  }

  // Update an existing shift
  async update(id: number, updateShiftInput: UpdateShiftInput): Promise<Shift> {
    await this.findOne(id);
    return this.prisma.shift.update({
      where: { id },
      data: updateShiftInput,
    });
  }

  // Remove a shift by its ID
  async remove(id: number): Promise<Shift> {
    await this.findOne(id);
    return this.prisma.shift.delete({
      where: { id },
    });
  }

  // Search shifts based on query (e.g., by shift name) and companyId

  async search(
    query: string,
    companyId: string,
    page = 1,
    limit = 10
  ): Promise<ShiftPaginatedResult> {
    try {
      const skip = (page - 1) * limit;

      const whereClause: any = {
        companyID: companyId,
      };

      if (query) {
        whereClause.OR = [
          {
            email: {
              contains: query,
              mode: "insensitive",
            },
          },
          {
            employeeName: {
              contains: query,
              mode: "insensitive",
            },
          },
        ];
      }

      const [shifts, totalCount] = await Promise.all([
        this.prisma.shift.findMany({
          where: whereClause,
          include: {
            profileDetails: true,
          },
          skip,
          take: limit,
        }),
        this.prisma.shift.count({
          where: whereClause,
        }),
      ]);

      return {
        shifts,
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
