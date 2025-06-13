import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaHrService } from "../../../../../prisma/prisma-hr.service";

@Injectable()
export class PayslipService {
  constructor(private readonly prisma: PrismaHrService) {}

  // Paginated list of payslips
  async findAll(page: number, limit: number): Promise<any> {
    console.log("ok");
    const [data, total] = await this.prisma.$transaction([
      this.prisma.employeePayroll.findMany({
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: "desc" },
        include: {
          profile: true,
        },
      }),
      this.prisma.employeePayroll.count(),
    ]);

    return {
      data,
      total,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findOne(profileId: number): Promise<any> {
    const payslip = await this.prisma.employeePayroll.findFirst({
      where: { profileId },
      orderBy: { createdAt: "desc" }, // get the latest one
      include: { profile: true },
    });

    if (!payslip) {
      throw new NotFoundException(
        `Payslip for profile ID ${profileId} not found`
      );
    }

    return payslip;
  }

  // Search payslips by employee name or employee ID
  async search(query: string, page: number, limit: number): Promise<any> {
    const orConditions: any[] = [
      { employeeName: { contains: query, mode: "insensitive" } },
    ];

    const profileIdNumber = Number(query);
    if (!isNaN(profileIdNumber)) {
      orConditions.push({ profileId: profileIdNumber });
    }

    const [data, total] = await this.prisma.$transaction([
      this.prisma.employeePayroll.findMany({
        where: { OR: orConditions },
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: "desc" },
        include: {
          profile: true,
        },
      }),
      this.prisma.employeePayroll.count({
        where: { OR: orConditions },
      }),
    ]);

    return {
      data,
      total,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
    };
  }
}
