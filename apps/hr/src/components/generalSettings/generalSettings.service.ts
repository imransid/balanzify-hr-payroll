import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaHrService } from "../../../../../prisma/prisma-hr.service";
import {
  CreateGeneralSettingsInput,
  UpdateGeneralSettingsInput,
  GeneralSettingsPaginatedResult,
} from "../dto/general-settings.input";
import { GeneralSettings } from "../entities/generalSettings.entity";

@Injectable()
export class GeneralSettingsService {
  constructor(private readonly prisma: PrismaHrService) {}

  async create(
    createGeneralSettingsInput: CreateGeneralSettingsInput
  ): Promise<GeneralSettings> {
    return this.prisma.generalSettings.create({
      data: createGeneralSettingsInput,
    });
  }

  async findAll(page = 1, limit = 10): Promise<GeneralSettingsPaginatedResult> {
    const skip = (page - 1) * limit;

    const [settings, totalCount] = await Promise.all([
      this.prisma.generalSettings.findMany({
        skip,
        take: limit,
        orderBy: {
          createdAt: "desc",
        },
      }),
      this.prisma.generalSettings.count(),
    ]);

    return {
      generalSettings: settings,
      totalCount,
      totalPages: Math.ceil(totalCount / limit),
      currentPage: page,
    };
  }

  async findOne(id: number): Promise<GeneralSettings> {
    const setting = await this.prisma.generalSettings.findUnique({
      where: { id },
    });
    if (!setting) {
      throw new NotFoundException(`GeneralSettings with ID ${id} not found`);
    }
    return setting;
  }

  async update(
    id: number,
    updateGeneralSettingsInput: UpdateGeneralSettingsInput
  ): Promise<GeneralSettings> {
    await this.findOne(id); // validate existence
    return this.prisma.generalSettings.update({
      where: { id },
      data: updateGeneralSettingsInput,
    });
  }

  async remove(id: number): Promise<GeneralSettings> {
    await this.findOne(id); // validate existence
    return this.prisma.generalSettings.delete({
      where: { id },
    });
  }

  async search(
    query: string,
    page = 1,
    limit = 10
  ): Promise<GeneralSettingsPaginatedResult> {
    const skip = (page - 1) * limit;

    const [settings, totalCount] = await Promise.all([
      this.prisma.generalSettings.findMany({
        where: {
          emailTemplate: { contains: query, mode: "insensitive" }, // You can modify this based on other searchable fields
        },
        skip,
        take: limit,
        orderBy: {
          createdAt: "desc",
        },
      }),
      this.prisma.generalSettings.count({
        where: {
          emailTemplate: { contains: query, mode: "insensitive" },
        },
      }),
    ]);

    return {
      generalSettings: settings,
      totalCount,
      totalPages: Math.ceil(totalCount / limit),
      currentPage: page,
    };
  }
}
