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
    return this.prisma.payrollAdditionAndDeduction.create({
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
      this.prisma.payrollAdditionAndDeduction.findMany({
        skip,
        take: limit,
      }),
      this.prisma.payrollAdditionAndDeduction.count(),
    ]);

    return {
      items: items,
      totalCount,
      totalPages: Math.ceil(totalCount / limit),
      currentPage: page,
    };
  }

  async findOne(id: number): Promise<PayrollAdditionAndDeduction> {
    const item = await this.prisma.payrollAdditionAndDeduction.findUnique({
      where: { id },
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

    return this.prisma.payrollAdditionAndDeduction.update({
      where: { id },
      data: {
        ...input,
      },
    });
  }

  async remove(id: number): Promise<PayrollAdditionAndDeduction> {
    await this.findOne(id);
    return this.prisma.payrollAdditionAndDeduction.delete({ where: { id } });
  }

  async search(
    query: string,
    page = 1,
    limit = 10
  ): Promise<PayrollAdditionAndDeductionPaginatedResult> {
    const skip = (page - 1) * limit;

    const [items, totalCount] = await Promise.all([
      this.prisma.payrollAdditionAndDeduction.findMany({
        where: {
          amount: { contains: query, mode: "insensitive" },
        },
        skip,
        take: limit,
      }),
      this.prisma.payrollAdditionAndDeduction.count({
        where: {
          amount: { contains: query, mode: "insensitive" },
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
