import { Resolver, Query, Mutation, Args, Int } from "@nestjs/graphql";
import { ProfileService } from "./profile.service";
import {
  CreateProfileInput,
  UpdateProfileInput,
  ProfilePaginatedResult,
  JobCardResponse,
} from "../dto/profile.input";
import { Profile } from "../entities/profile.entity";
import { NotFoundException } from "@nestjs/common";
import { GraphQLException } from "exceptions/graphql-exception";
import { GraphQLJSONObject } from "graphql-type-json";

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
    limit: number,
    @Args("companyId", { type: () => String, nullable: true })
    companyId: string
  ): Promise<ProfilePaginatedResult> {
    try {
      return await this.profileService.findAll(page, limit, companyId);
    } catch (error) {
      throw new GraphQLException(
        "Failed to fetch profiles",
        "INTERNAL_SERVER_ERROR"
      );
    }
  }

  @Query(() => Profile, { nullable: true })
  async profile(
    @Args("id", { type: () => Int, nullable: true }) id?: number,
    @Args("employeeID", { type: () => String, nullable: true })
    employeeID?: string
  ): Promise<Profile> {
    try {
      const profile = await this.profileService.findOne(id, employeeID);

      if (!profile) {
        throw new GraphQLException(
          `Profile not found with ID ${id} or Employee ID ${employeeID}`,
          "NOT_FOUND"
        );
      }

      return profile;
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
        "Failed to remove profile" + error.toString(),
        "INTERNAL_SERVER_ERROR"
      );
    }
  }

  @Query(() => ProfilePaginatedResult)
  async searchProfiles(
    @Args("query", { type: () => String, nullable: true }) query?: string,
    companyID?: string,
    @Args("page", { type: () => Int, nullable: true, defaultValue: 1 })
    page = 1,
    @Args("limit", { type: () => Int, nullable: true, defaultValue: 10 })
    limit = 10
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

  @Query(() => GraphQLJSONObject)
  async gettingJobCard(
    @Args("profileId", { type: () => Int, nullable: true }) profileId?: number,
    @Args("employeeID", { type: () => String, nullable: true })
    employeeID?: string
  ): Promise<JobCardResponse> {
    try {
      return await this.profileService.gettingJobCard(employeeID, profileId);
    } catch (error) {
      throw new GraphQLException(
        "Failed to search gettingJobCard",
        "INTERNAL_SERVER_ERROR"
      );
    }
  }
}
