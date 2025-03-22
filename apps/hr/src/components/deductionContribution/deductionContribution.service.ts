import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaHrService } from "../../../../../prisma/prisma-hr.service";
import {
  CreateDeductionContributionInput,
  UpdateDeductionContributionInput,
  DeductionContributionPaginatedResult,
} from "../dto/deductionContribution.input";
import { DeductionContribution } from "../entities/deductionContribution.entity";

@Injectable()
export class DeductionContributionService {
  constructor(private readonly prisma: PrismaHrService) {}

  async create(
    createDeductionContributionInput: CreateDeductionContributionInput
  ): Promise<DeductionContribution> {
    return this.prisma.deductionContribution.create({
      data: createDeductionContributionInput,
    });
  }

  async findAll(
    page = 1,
    limit = 10
  ): Promise<DeductionContributionPaginatedResult> {
    const skip = (page - 1) * limit;

    const [deductionContributions, totalCount] = await Promise.all([
      this.prisma.deductionContribution.findMany({
        skip,
        take: limit,
      }) || [], // Ensure it's always an array
      this.prisma.deductionContribution.count(),
    ]);

    return {
      deductionContributions: Array.isArray(deductionContributions)
        ? deductionContributions
        : [], // Safety check
      totalPages: Math.ceil(totalCount / limit),
      currentPage: page,
      totalCount,
    };
  }

  async findOne(id: number): Promise<DeductionContribution> {
    const deductionContribution =
      await this.prisma.deductionContribution.findUnique({
        where: { id },
      });
    if (!deductionContribution) {
      throw new NotFoundException(
        `DeductionContribution with ID ${id} not found`
      );
    }
    return deductionContribution;
  }

  async update(
    id: number,
    updateDeductionContributionInput: UpdateDeductionContributionInput
  ): Promise<DeductionContribution> {
    await this.findOne(id);
    return this.prisma.deductionContribution.update({
      where: { id },
      data: updateDeductionContributionInput,
    });
  }

  async remove(id: number): Promise<DeductionContribution> {
    await this.findOne(id);
    return this.prisma.deductionContribution.delete({
      where: { id },
    });
  }

  async search(
    query: string,
    page = 1,
    limit = 10
  ): Promise<DeductionContributionPaginatedResult> {
    const skip = (page - 1) * limit;

    const [deductionContributions, totalCount] = await Promise.all([
      this.prisma.deductionContribution.findMany({
        where: {
          title: { contains: query, mode: "insensitive" }, // ✅ Corrected search filter
        },
        skip,
        take: limit,
      }),
      this.prisma.deductionContribution.count({
        where: {
          title: { contains: query, mode: "insensitive" },
        },
      }),
    ]);

    return {
      deductionContributions: deductionContributions, // ✅ Ensure it matches HolidayPaginatedResult type
      totalCount, // ✅ Matches DTO property
      totalPages: Math.ceil(totalCount / limit),
      currentPage: page,
    };
  }
}
