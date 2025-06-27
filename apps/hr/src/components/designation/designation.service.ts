import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaHrService } from "../../../../../prisma/prisma-hr.service";
import {
  CreateDesignationInput,
  UpdateDesignationInput,
  DesignationsPaginatedResult,
} from "../dto/designation.input";
import { Designation } from "../entities/designation.entity";

@Injectable()
export class DesignationService {
  constructor(private readonly prisma: PrismaHrService) {}

  async create(
    createDesignationInput: CreateDesignationInput
  ): Promise<Designation> {
    return this.prisma.designation.create({
      data: createDesignationInput,
    });
  }

  async findAll(
    page = 1,
    limit = 10,
    companyId: string
  ): Promise<DesignationsPaginatedResult> {
    const skip = (page - 1) * limit;

    const [designations, totalCount] = await Promise.all([
      this.prisma.designation.findMany({
        skip,
        take: limit,
        where: { companyId }, // Filter by companyId
      }) || [], // Ensure it's always an array
      this.prisma.designation.count({
        where: { companyId }, // Ensure count is scoped to the same filter
      }),
    ]);

    return {
      designations: Array.isArray(designations) ? designations : [], // Safety check
      totalPages: Math.ceil(totalCount / limit),
      currentPage: page,
      totalCount,
    };
  }

  async findOne(id: number): Promise<Designation> {
    const designation = await this.prisma.designation.findUnique({
      where: { id },
    });
    if (!designation) {
      throw new NotFoundException(`designation with ID ${id} not found`);
    }
    return designation;
  }

  async update(
    id: number,
    updateDesignationInput: UpdateDesignationInput
  ): Promise<Designation> {
    await this.findOne(id);
    return this.prisma.designation.update({
      where: { id },
      data: updateDesignationInput,
    });
  }

  async remove(id: number): Promise<Designation> {
    await this.findOne(id);
    return this.prisma.designation.delete({
      where: { id },
    });
  }

  async search(
    query: string,
    companyId: string,
    page = 1,
    limit = 10
  ): Promise<DesignationsPaginatedResult> {
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

      const [designations, totalCount] = await Promise.all([
        this.prisma.designation.findMany({
          where: whereClause,

          skip,
          take: limit,
        }),
        this.prisma.designation.count({
          where: whereClause,
        }),
      ]);

      return {
        designations,
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
