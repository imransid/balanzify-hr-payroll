// src/campaign/campaign.service.ts
import { Injectable } from '@nestjs/common';
import { PrismaPageBuilderService } from '../../../../../prisma/prisma-page-builder.service';
import { CreateCampaignDto, UpdateCampaignDto } from '../dto/campaign.dto';

@Injectable()
export class CampaignService {
  constructor(private readonly prisma: PrismaPageBuilderService) {}

  async create(data: CreateCampaignDto) {
    return this.prisma.campaign.create({ data });
  }

  async findAll() {
    return this.prisma.campaign.findMany();
  }

  async findOne(id: number) {
    return this.prisma.campaign.findUnique({ where: { id } });
  }

  async update(id: number, data: UpdateCampaignDto) {
    return this.prisma.campaign.update({ where: { id }, data });
  }

  async remove(id: number) {
    return this.prisma.campaign.delete({ where: { id } });
  }
}
