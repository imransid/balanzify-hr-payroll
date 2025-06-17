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

  async findAll(page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit;

    const [data, totalCount] = await Promise.all([
      this.prisma.generalTax.findMany({
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

  async search(query: string, page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit;

    const [data, totalCount] = await Promise.all([
      this.prisma.generalTax.findMany({
        where: {
          OR: [
            { companyLegalName: { contains: query, mode: "insensitive" } },
            { companyType: { contains: query, mode: "insensitive" } },
            { city: { contains: query, mode: "insensitive" } },
            { state1: { contains: query, mode: "insensitive" } },
            { streetAddress1: { contains: query, mode: "insensitive" } },
          ],
        },
        skip,
        take: limit,
        orderBy: { id: "desc" },
      }),
      this.prisma.generalTax.count({
        where: {
          OR: [
            { companyLegalName: { contains: query, mode: "insensitive" } },
            { companyType: { contains: query, mode: "insensitive" } },
            { city: { contains: query, mode: "insensitive" } },
            { state1: { contains: query, mode: "insensitive" } },
            { streetAddress1: { contains: query, mode: "insensitive" } },
          ],
        },
      }),
    ]);

    const totalPages = Math.ceil(totalCount / limit);

    return {
      generalTaxes: data,
      totalPages,
      currentPage: page,
      totalCount,
    };
  }
}
