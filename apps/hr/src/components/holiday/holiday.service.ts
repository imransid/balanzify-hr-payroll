import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaHrService } from '../../../../../prisma/prisma-hr.service';
import {
  CreateHolidayInput,
  HolidayPaginatedResult,
  UpdateHolidayInput,
} from '../dto/holiday.input';
import { Holiday } from '../entities/holiday.entity';

@Injectable()
export class HolidayService {
  constructor(private readonly prisma: PrismaHrService) {}

  async create(createHolidayInput: CreateHolidayInput): Promise<Holiday> {
    return this.prisma.holiday.create({
      data: createHolidayInput,
    });
  }

  async findAll(page = 1, limit = 10): Promise<HolidayPaginatedResult> {
    const skip = (page - 1) * limit;

    const [holidays, totalCount] = await Promise.all([
      this.prisma.holiday.findMany({
        skip,
        take: limit,
      }) || [], // Ensure it's always an array
      this.prisma.holiday.count(),
    ]);

    return {
      holidays: Array.isArray(holidays) ? holidays : [], // Safety check
      totalPages: Math.ceil(totalCount / limit),
      currentPage: page,
      totalCount,
    };
  }

  async findOne(id: number): Promise<Holiday> {
    const holiday = await this.prisma.holiday.findUnique({ where: { id } });
    if (!holiday) {
      throw new NotFoundException(`Holiday with ID ${id} not found`);
    }
    return holiday;
  }

  async update(
    id: number,
    updateHolidayInput: UpdateHolidayInput,
  ): Promise<Holiday> {
    await this.findOne(id);
    return this.prisma.holiday.update({
      where: { id },
      data: updateHolidayInput,
    });
  }

  async remove(id: number): Promise<Holiday> {
    await this.findOne(id);
    return this.prisma.holiday.delete({
      where: { id },
    });
  }

  async search(
    query: string,
    page = 1,
    limit = 10,
  ): Promise<HolidayPaginatedResult> {
    const skip = (page - 1) * limit;

    const [holidays, totalCount] = await Promise.all([
      this.prisma.holiday.findMany({
        where: {
          name: { contains: query, mode: 'insensitive' }, // ✅ Corrected search filter
        },
        skip,
        take: limit,
      }),
      this.prisma.holiday.count({
        where: {
          name: { contains: query, mode: 'insensitive' },
        },
      }),
    ]);

    return {
      holidays: holidays, // ✅ Ensure it matches HolidayPaginatedResult type
      totalCount, // ✅ Matches DTO property
      totalPages: Math.ceil(totalCount / limit),
      currentPage: page,
    };
  }
}
