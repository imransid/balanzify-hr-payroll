import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaHrService } from "../../../../../prisma/prisma-hr.service";
import {
  CreateHolidayInput,
  HolidayPaginatedResult,
  UpdateHolidayInput,
} from "../dto/holiday.input";
import { Holiday } from "../entities/holiday.entity";

@Injectable()
export class HolidayService {
  constructor(private readonly prisma: PrismaHrService) {}

  async create(createHolidayInput: CreateHolidayInput): Promise<Holiday> {
    const {
      details,
      name,
      color,
      fromDate,
      toDate,
      country,
      weekend,
      totalHoliday,
      status,
    } = createHolidayInput;

    return this.prisma.holiday.create({
      data: {
        name,
        color,
        fromDate,
        toDate,
        country,
        weekend,
        totalHoliday,
        status,
        details: details
          ? {
              create: details.map((d) => ({
                No: d.No,
                Date: d.Date,
                Type: d.Type,
                Description: d.Description,
              })),
            }
          : undefined,
      },
      include: {
        details: true, // Optional: include holidayDetails in the response
      },
    });
  }

  async findAll(page = 1, limit = 10): Promise<HolidayPaginatedResult> {
    const skip = (page - 1) * limit;

    const [holidays, totalCount] = await Promise.all([
      this.prisma.holiday.findMany({
        skip,
        take: limit,
        include: {
          details: true,
        },
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
    const holiday = await this.prisma.holiday.findUnique({
      where: { id },
      include: {
        details: true,
      },
    });
    if (!holiday) {
      throw new NotFoundException(`Holiday with ID ${id} not found`);
    }
    return holiday;
  }

  async update(
    id: number,
    updateHolidayInput: UpdateHolidayInput
  ): Promise<Holiday> {
    await this.findOne(id);

    const {
      details, // extract details
      ...rest // everything else goes in rest
    } = updateHolidayInput;

    return this.prisma.holiday.update({
      where: { id },
      data: {
        ...rest,
        ...(details && {
          // First delete old details, then create new
          details: {
            deleteMany: {}, // remove all previous details
            create: details.map((d) => ({
              No: d.No,
              Date: d.Date,
              Type: d.Type,
              Description: d.Description,
            })),
          },
        }),
      },
      include: {
        details: true,
      },
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
    limit = 10
  ): Promise<HolidayPaginatedResult> {
    const skip = (page - 1) * limit;

    const [holidays, totalCount] = await Promise.all([
      this.prisma.holiday.findMany({
        where: {
          name: { contains: query, mode: "insensitive" }, // ✅ Corrected search filter
        },
        skip,
        take: limit,
      }),
      this.prisma.holiday.count({
        where: {
          name: { contains: query, mode: "insensitive" },
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
