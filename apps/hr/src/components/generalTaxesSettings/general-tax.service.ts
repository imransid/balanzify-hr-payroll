import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaHrService } from "../../../../../prisma/prisma-hr.service";
import {
  CreateGeneralTaxInput,
  UpdateGeneralTaxInput,
} from "../dto/generalTax.input";
import { GeneralTax } from "../entities/general-tax.entity";

@Injectable()
export class GeneralTaxService {
  constructor(private readonly prisma: PrismaHrService) {}

  async create(createInput: CreateGeneralTaxInput): Promise<GeneralTax> {
    return this.prisma.generalTax.create({
      data: createInput,
    });
  }

  async findAll(page: number = 1, limit: number = 10, companyId: string) {
    const skip = (page - 1) * limit;

    const [data, totalCount] = await Promise.all([
      this.prisma.generalTax.findMany({
        where: {
          companyId: companyId,
        },
        skip,
        take: limit,
        orderBy: { id: "desc" },
      }),
      this.prisma.generalTax.count(),
    ]);

    const totalPages = Math.ceil(totalCount / limit);

    return {
      generalTaxes: data,
      totalPages,
      currentPage: page,
      totalCount,
    };
  }

  async findOne(id: number): Promise<GeneralTax> {
    const record = await this.prisma.generalTax.findUnique({
      where: { id },
    });

    if (!record) {
      throw new NotFoundException(`GeneralTax with ID ${id} not found`);
    }

    return record;
  }

  async update(
    id: number,
    updateInput: UpdateGeneralTaxInput
  ): Promise<GeneralTax> {
    const exists = await this.prisma.generalTax.findUnique({ where: { id } });

    if (!exists) {
      throw new NotFoundException(`GeneralTax with ID ${id} not found`);
    }

    return this.prisma.generalTax.update({
      where: { id },
      data: updateInput,
    });
  }

  async remove(id: number): Promise<GeneralTax> {
    const record = await this.prisma.generalTax.findUnique({ where: { id } });

    if (!record) {
      throw new NotFoundException(`GeneralTax with ID ${id} not found`);
    }

    return this.prisma.generalTax.delete({ where: { id } });
  }

  async search(query: string, companyId: string, page = 1, limit = 10) {
    try {
      const skip = (page - 1) * limit;

      const whereClause: any = {
        companyId: companyId,
      };

      if (query) {
        whereClause.OR = [
          {
            companyLegalName: {
              contains: query,
              mode: "insensitive",
            },
            companyType: {
              contains: query,
              mode: "insensitive",
            },
            city: {
              contains: query,
              mode: "insensitive",
            },
          },
        ];
      }

      const [generalTaxes, totalCount] = await Promise.all([
        this.prisma.generalTax.findMany({
          where: whereClause,

          skip,
          take: limit,
        }),
        this.prisma.generalTax.count({
          where: whereClause,
        }),
      ]);

      return {
        generalTaxes,
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
