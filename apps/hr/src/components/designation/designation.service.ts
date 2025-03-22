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

  async findAll(page = 1, limit = 10): Promise<DesignationsPaginatedResult> {
    const skip = (page - 1) * limit;

    const [designations, totalCount] = await Promise.all([
      this.prisma.designation.findMany({
        skip,
        take: limit,
      }) || [], // Ensure it's always an array
      this.prisma.designation.count(),
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
    page = 1,
    limit = 10
  ): Promise<DesignationsPaginatedResult> {
    const skip = (page - 1) * limit;

    const [designations, totalCount] = await Promise.all([
      this.prisma.designation.findMany({
        where: {
          designationName: { contains: query, mode: "insensitive" }, // ✅ Corrected search filter
        },
        skip,
        take: limit,
      }),
      this.prisma.designation.count({
        where: {
          designationName: { contains: query, mode: "insensitive" },
        },
      }),
    ]);

    return {
      designations: designations, // ✅ Ensure it matches designation type
      totalCount, // ✅ Matches DTO property
      totalPages: Math.ceil(totalCount / limit),
      currentPage: page,
    };
  }
}
