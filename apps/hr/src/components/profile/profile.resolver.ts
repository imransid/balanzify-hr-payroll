import { Resolver, Query, Mutation, Args, Int } from "@nestjs/graphql";
import { ProfileService } from "./profile.service";
import {
  CreateProfileInput,
  UpdateProfileInput,
  ProfilePaginatedResult,
} from "../dto/profile.input";
import { Profile } from "../entities/profile.entity";
import { NotFoundException } from "@nestjs/common";
import { GraphQLException } from "exceptions/graphql-exception";

@Resolver(() => Profile)
export class ProfileResolver {
  constructor(private readonly profileService: ProfileService) {}

  @Mutation(() => Profile)
  async createProfile(
    @Args("createProfileInput") createProfileInput: CreateProfileInput
  ): Promise<Profile> {
    try {
      return await this.profileService.create(createProfileInput);
    } catch (error) {
      throw new GraphQLException(
        "Failed to create profile",
        "INTERNAL_SERVER_ERROR"
      );
    }
  }

  @Query(() => ProfilePaginatedResult)
  async profiles(
    @Args("page", { type: () => Int, nullable: true, defaultValue: 1 })
    page: number,
    @Args("limit", { type: () => Int, nullable: true, defaultValue: 10 })
    limit: number
  ): Promise<ProfilePaginatedResult> {
    try {
      return await this.profileService.findAll(page, limit);
    } catch (error) {
      throw new GraphQLException(
        "Failed to fetch profiles",
        "INTERNAL_SERVER_ERROR"
      );
    }
  }

  @Query(() => Profile)
  async profile(@Args("id", { type: () => Int }) id: number): Promise<Profile> {
    try {
      return await this.profileService.findOne(id);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new GraphQLException(
          `Profile with ID ${id} not found`,
          "NOT_FOUND"
        );
      }
      throw new GraphQLException(
        "Failed to fetch profile",
        "INTERNAL_SERVER_ERROR"
      );
    }
  }

  @Mutation(() => Profile)
  async updateProfile(
    @Args("id", { type: () => Int }) id: number,
    @Args("updateProfileInput") updateProfileInput: UpdateProfileInput
  ): Promise<Profile> {
    try {
      return await this.profileService.update(id, updateProfileInput);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new GraphQLException(
          `Profile with ID ${id} not found`,
          "NOT_FOUND"
        );
      }
      throw new GraphQLException(
        "Failed to update profile",
        "INTERNAL_SERVER_ERROR"
      );
    }
  }

  @Mutation(() => Profile)
  async removeProfile(
    @Args("id", { type: () => Int }) id: number
  ): Promise<Profile> {
    try {
      return await this.profileService.remove(id);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new GraphQLException(
          `Profile with ID ${id} not found`,
          "NOT_FOUND"
        );
      }
      throw new GraphQLException(
        "Failed to remove profile",
        "INTERNAL_SERVER_ERROR"
      );
    }
  }

  @Query(() => ProfilePaginatedResult)
  async searchProfiles(
    @Args("query", { type: () => String }) query: string,
    @Args("page", { type: () => Int, nullable: true, defaultValue: 1 })
    page: number,
    @Args("limit", { type: () => Int, nullable: true, defaultValue: 10 })
    limit: number
  ): Promise<ProfilePaginatedResult> {
    try {
      return await this.profileService.search(query, page, limit);
    } catch (error) {
      throw new GraphQLException(
        "Failed to search profiles",
        "INTERNAL_SERVER_ERROR"
      );
    }
  }
}