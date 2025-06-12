import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaHrService } from "../../../../../prisma/prisma-hr.service";
import {
  CreatePayrollAdditionAndDeductionInput,
  UpdatePayrollAdditionAndDeductionInput,
  PayrollAdditionAndDeductionPaginatedResult,
} from "../dto/additionAndDeduction";
import { PayrollAdditionAndDeduction } from "../entities/payroll-addition-and-deduction.entity";

@Injectable()
export class AdditionAndDeductionService {
  constructor(private readonly prisma: PrismaHrService) {}

  async create(
    input: CreatePayrollAdditionAndDeductionInput
  ): Promise<PayrollAdditionAndDeduction> {
    return this.prisma.additionAndDeduction.create({
      data: {
        ...input,
      },
    });
  }

  async findAll(
    page = 1,
    limit = 10
  ): Promise<PayrollAdditionAndDeductionPaginatedResult> {
    const skip = (page - 1) * limit;

    const [items, totalCount] = await Promise.all([
      this.prisma.additionAndDeduction.findMany({
        skip,
        take: limit,
        include: { details: true },
      }),
      this.prisma.additionAndDeduction.count(),
    ]);

    return {
      items: items,
      totalCount,
      totalPages: Math.ceil(totalCount / limit),
      currentPage: page,
    };
  }

  async findOne(id: number): Promise<PayrollAdditionAndDeduction> {
    const item = await this.prisma.additionAndDeduction.findUnique({
      where: { id },
      include: { details: true },
    });

    if (!item) {
      throw new NotFoundException(
        `AdditionAndDeduction with ID ${id} not found`
      );
    }

    return item;
  }

  async update(
    id: number,
    input: UpdatePayrollAdditionAndDeductionInput
  ): Promise<PayrollAdditionAndDeduction> {
    await this.findOne(id);

    return this.prisma.additionAndDeduction.update({
      where: { id },
      data: {
        ...input,
      },
    });
  }

  async remove(id: number): Promise<PayrollAdditionAndDeduction> {
    await this.findOne(id);
    return this.prisma.additionAndDeduction.delete({ where: { id } });
  }

  async search(
    query: string,
    page = 1,
    limit = 10
  ): Promise<PayrollAdditionAndDeductionPaginatedResult> {
    const skip = (page - 1) * limit;

    const [items, totalCount] = await Promise.all([
      this.prisma.additionAndDeduction.findMany({
        where: {
          title: { contains: query, mode: "insensitive" },
        },
        skip,
        take: limit,
        include: { details: true },
      }),
      this.prisma.additionAndDeduction.count({
        where: {
          title: { contains: query, mode: "insensitive" },
        },
      }),
    ]);

    return {
      items: items,
      totalCount,
      totalPages: Math.ceil(totalCount / limit),
      currentPage: page,
    };
  }
}
