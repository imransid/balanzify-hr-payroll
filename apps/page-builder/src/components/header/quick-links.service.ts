import { HttpException, HttpStatus, Inject, Injectable, Logger } from '@nestjs/common';
import { PrismaPageBuilderService } from '../../../../../prisma/prisma-page-builder.service';
import { CreateQuickLinksInput } from '../dto/create-quick-links.input';
import {  UpdateQuickLinksInput } from '../dto/update-quick-links.input';

@Injectable()
export class QuickLinksService {
 private logger = new Logger('Quick Links  service'); 

  constructor(
    @Inject(PrismaPageBuilderService) private prismaService: PrismaPageBuilderService
  ) {}

  async create(createQuickLinksInput: CreateQuickLinksInput) {
    try{
      const response = await this.prismaService.quickLinks.create({ 
        data: {
            ...createQuickLinksInput
        }
      });
      return response;
    } catch(e){
      throw new HttpException(
        `Error creating  Quick lInks: ${e}`,
        500
      )
    }
  }

  async findAll(page,limit = 20) {
    return await this.prismaService.quickLinks.findMany({  take: limit });
  }

  async findOne(id: number) {
    return await this.prismaService.quickLinks.findUnique({
      where:{
        id
      }
    });
  }

  async update(id: number, updateQuickLinksInput: UpdateQuickLinksInput) {
    const isQuickLInksExist = await this.prismaService.quickLinks.findUnique({
      where:{
        id
      }
    });
    if(isQuickLInksExist){
      const updatedQuickLinks = await this.prismaService.quickLinks.update({
        data:{
          ...updateQuickLinksInput
        },
        where:{
          id
        }
      });
      return updatedQuickLinks;
    } else {
      throw new HttpException('Quick lInks not exist', HttpStatus.BAD_REQUEST);
    }
  }

  async remove(id: number) {
    try {
      const isQuickLInksExist = await this.prismaService.quickLinks.findUnique({
        where:{
          id
        }
      });
      if(isQuickLInksExist){
        await this.prismaService.quickLinks.delete({
          where:{
            id
          }
        });
        return isQuickLInksExist;
      } else {
        throw new HttpException('Quick lInks not exist', HttpStatus.BAD_REQUEST);
      }
  } catch(e) {
    throw new HttpException(
      `Error Deleting Quick lInks: ${e}`,
      500
    )
  }
 }
}
