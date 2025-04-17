import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaHrService } from "../../../../../prisma/prisma-hr.service";
import {
  CreateAttendanceInput,
  UpdateAttendanceInput,
} from "../dto/attendance.input";
import { Attendance } from "../entities/attendance.entity";
import { AttendancePaginatedResult } from "../dto/attendance.input"; // Adjust path if needed

@Injectable()
export class AttendanceService {
  constructor(private readonly prisma: PrismaHrService) {}

  async create(
    createAttendanceInput: CreateAttendanceInput
  ): Promise<Attendance> {
    return this.prisma.attendance.create({
      data: createAttendanceInput,
    });
  }

  async findAll(page = 1, limit = 10): Promise<AttendancePaginatedResult> {
    const skip = (page - 1) * limit;

    const [attendances, totalCount] = await Promise.all([
      this.prisma.attendance.findMany({
        skip,
        take: limit,
        orderBy: {
          date: "desc",
        },
      }),
      this.prisma.attendance.count(),
    ]);

    return {
      attendances,
      totalPages: Math.ceil(totalCount / limit),
      currentPage: page,
      totalCount,
    };
  }

  async findOne(id: number): Promise<Attendance> {
    const attendance = await this.prisma.attendance.findUnique({
      where: { id },
    });
    if (!attendance) {
      throw new NotFoundException(`Attendance with ID ${id} not found`);
    }
    return attendance;
  }

  async update(
    id: number,
    updateAttendanceInput: UpdateAttendanceInput
  ): Promise<Attendance> {
    await this.findOne(id); // Ensures it exists
    return this.prisma.attendance.update({
      where: { id },
      data: updateAttendanceInput,
    });
  }

  async remove(id: number): Promise<Attendance> {
    await this.findOne(id); // Ensures it exists
    return this.prisma.attendance.delete({
      where: { id },
    });
  }

  async search(
    query: string,
    page = 1,
    limit = 10
  ): Promise<AttendancePaginatedResult> {
    const skip = (page - 1) * limit;

    const [attendances, totalCount] = await Promise.all([
      this.prisma.attendance.findMany({
        where: {
          employeeId: { contains: query, mode: "insensitive" },
        },
        skip,
        take: limit,
        orderBy: {
          date: "desc",
        },
      }),
      this.prisma.attendance.count({
        where: {
          employeeId: { contains: query, mode: "insensitive" },
        },
      }),
    ]);

    return {
      attendances,
      totalCount,
      totalPages: Math.ceil(totalCount / limit),
      currentPage: page,
    };
  }
}
