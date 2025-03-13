import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { PrismaPageBuilderService } from '../../../../../prisma/prisma-page-builder.service';
import { Report } from '../entities/report.entity';
import { CreateReportInput, UpdateReportInput } from '../dto/report.input';

@Injectable()
export class ReportService {
  private logger = new Logger('ReportService');

  constructor(private prisma: PrismaPageBuilderService) {}

  // Create a new Report
  async create(createReportInput: CreateReportInput): Promise<Report> {
    try {
      const createdReport = await this.prisma.reportResult.create({
        data: { ...createReportInput },
      });
      return createdReport;
    } catch (error) {
      this.logger.error(
        `Failed to create Report: ${error.message}`,
        error.stack,
      );
      throw new HttpException(
        `Failed to create Report: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // Retrieve all Reports with pagination
  async findAll(page: number = 1, limit: number = 10): Promise<Report[]> {
    try {
      const skip = (page - 1) * limit;
      return await this.prisma.reportResult.findMany({ skip, take: limit });
    } catch (error) {
      this.logger.error(
        `Failed to retrieve Reports: ${error.message}`,
        error.stack,
      );
      throw new HttpException(
        `Failed to retrieve Reports: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // Retrieve a specific Report by ID
  async findOne(id: number): Promise<Report> {
    try {
      const report = await this.prisma.reportResult.findUnique({
        where: { id },
      });

      if (!report) {
        throw new HttpException(
          `Report with ID ${id} not found`,
          HttpStatus.NOT_FOUND,
        );
      }

      return report;
    } catch (error) {
      this.logger.error(
        `Failed to retrieve Report ID ${id}: ${error.message}`,
        error.stack,
      );
      throw new HttpException(
        `Failed to retrieve Report ID ${id}: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // Update a Report
  async update(
    id: number,
    updateReportInput: UpdateReportInput,
  ): Promise<Report> {
    try {
      const updated = await this.prisma.reportResult.update({
        where: { id },
        data: { ...updateReportInput },
      });
      return updated;
    } catch (error) {
      this.logger.error(
        `Failed to update Report ID ${id}: ${error.message}`,
        error.stack,
      );
      throw new HttpException(
        `Failed to update Report ID ${id}: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // Delete a Report
  async remove(id: number): Promise<void> {
    try {
      await this.prisma.reportResult.delete({ where: { id } });
    } catch (error) {
      this.logger.error(
        `Failed to delete Report ID ${id}: ${error.message}`,
        error.stack,
      );
      throw new HttpException(
        `Failed to delete Report ID ${id}: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
