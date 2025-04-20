import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaHrService } from "../../../../../prisma/prisma-hr.service";
import {
  CreateProfileDetailsInput,
  UpdateProfileDetailsInput,
} from "../dto/profileDetails.input";
import { ProfileDetails } from "../entities/profileDetails.entity";
import { ProfileDetailsPaginatedResult } from "../dto/profileDetails.input";

@Injectable()
export class ProfileDetailsService {
  constructor(private readonly prisma: PrismaHrService) {}

  async create(
    createProfileDetailsInput: CreateProfileDetailsInput
  ): Promise<ProfileDetails> {
    return this.prisma.profileDetails.create({
      data: createProfileDetailsInput,
    });
  }

  async findAll(page = 1, limit = 10): Promise<ProfileDetailsPaginatedResult> {
    const skip = (page - 1) * limit;

    const [items, totalCount] = await Promise.all([
      this.prisma.profileDetails.findMany({
        skip,
        take: limit,
        orderBy: {
          id: "desc",
        },
      }),
      this.prisma.profileDetails.count(),
    ]);

    return {
      profileDetails: items,
      totalPages: Math.ceil(totalCount / limit),
      currentPage: page,
      totalCount,
    };
  }

  async findOne(id: number): Promise<ProfileDetails> {
    const item = await this.prisma.profileDetails.findUnique({
      where: { id },
    });
    if (!item) {
      throw new NotFoundException(`ProfileDetails with ID ${id} not found`);
    }
    return item;
  }

  async update(
    id: number,
    updateProfileDetailsInput: UpdateProfileDetailsInput
  ): Promise<ProfileDetails> {
    await this.findOne(id); // Ensure existence
    return this.prisma.profileDetails.update({
      where: { id },
      data: updateProfileDetailsInput,
    });
  }

  async remove(id: number): Promise<ProfileDetails> {
    await this.findOne(id); // Ensure existence
    return this.prisma.profileDetails.delete({
      where: { id },
    });
  }

  async search(
    query: string,
    page = 1,
    limit = 10
  ): Promise<ProfileDetailsPaginatedResult> {
    const skip = (page - 1) * limit;

    const [items, totalCount] = await Promise.all([
      this.prisma.profileDetails.findMany({
        where: {
          firstName: { contains: query, mode: "insensitive" }, // Adjust field name based on your model
        },
        skip,
        take: limit,
        orderBy: {
          id: "desc",
        },
      }),
      this.prisma.profileDetails.count({
        where: {
          firstName: { contains: query, mode: "insensitive" },
        },
      }),
    ]);

    return {
      profileDetails: items,
      totalCount,
      totalPages: Math.ceil(totalCount / limit),
      currentPage: page,
    };
  }
}
