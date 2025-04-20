import { Resolver, Query, Mutation, Args, Int } from "@nestjs/graphql";
import { ProfileDetailsService } from "./profileDetails.service";
import {
  CreateProfileDetailsInput,
  UpdateProfileDetailsInput,
} from "../dto/profileDetails.input";
import { ProfileDetailsPaginatedResult } from "../dto/profileDetails.input";
import { ProfileDetails } from "../entities/profileDetails.entity";
import { NotFoundException } from "@nestjs/common";
import { GraphQLException } from "exceptions/graphql-exception";

@Resolver(() => ProfileDetails)
export class ProfileDetailsResolver {
  constructor(private readonly profileDetailsService: ProfileDetailsService) {}

  @Mutation(() => ProfileDetails)
  async createProfileDetails(
    @Args("createProfileDetailsInput")
    createProfileDetailsInput: CreateProfileDetailsInput
  ): Promise<ProfileDetails> {
    try {
      return await this.profileDetailsService.create(createProfileDetailsInput);
    } catch (error) {
      throw new GraphQLException(
        "Failed to create profile details",
        "INTERNAL_SERVER_ERROR"
      );
    }
  }

  @Query(() => ProfileDetailsPaginatedResult)
  async profileDetailsList(
    @Args("page", { type: () => Int, nullable: true, defaultValue: 1 })
    page: number,
    @Args("limit", { type: () => Int, nullable: true, defaultValue: 10 })
    limit: number
  ): Promise<ProfileDetailsPaginatedResult> {
    try {
      return await this.profileDetailsService.findAll(page, limit);
    } catch (error) {
      throw new GraphQLException(
        "Failed to fetch profile details",
        "INTERNAL_SERVER_ERROR"
      );
    }
  }

  @Query(() => ProfileDetails)
  async profileDetails(
    @Args("id", { type: () => Int }) id: number
  ): Promise<ProfileDetails> {
    try {
      return await this.profileDetailsService.findOne(id);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new GraphQLException(
          `ProfileDetails with ID ${id} not found`,
          "NOT_FOUND"
        );
      }
      throw new GraphQLException(
        "Failed to fetch profile details",
        "INTERNAL_SERVER_ERROR"
      );
    }
  }

  @Mutation(() => ProfileDetails)
  async updateProfileDetails(
    @Args("id", { type: () => Int }) id: number,
    @Args("updateProfileDetailsInput")
    updateProfileDetailsInput: UpdateProfileDetailsInput
  ): Promise<ProfileDetails> {
    try {
      return await this.profileDetailsService.update(
        id,
        updateProfileDetailsInput
      );
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new GraphQLException(
          `ProfileDetails with ID ${id} not found`,
          "NOT_FOUND"
        );
      }
      throw new GraphQLException(
        "Failed to update profile details",
        "INTERNAL_SERVER_ERROR"
      );
    }
  }

  @Mutation(() => ProfileDetails)
  async removeProfileDetails(
    @Args("id", { type: () => Int }) id: number
  ): Promise<ProfileDetails> {
    try {
      return await this.profileDetailsService.remove(id);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new GraphQLException(
          `ProfileDetails with ID ${id} not found`,
          "NOT_FOUND"
        );
      }
      throw new GraphQLException(
        "Failed to remove profile details",
        "INTERNAL_SERVER_ERROR"
      );
    }
  }

  @Query(() => ProfileDetailsPaginatedResult)
  async searchProfileDetails(
    @Args("query", { type: () => String }) query: string,
    @Args("page", { type: () => Int, nullable: true, defaultValue: 1 })
    page: number,
    @Args("limit", { type: () => Int, nullable: true, defaultValue: 10 })
    limit: number
  ): Promise<ProfileDetailsPaginatedResult> {
    try {
      return await this.profileDetailsService.search(query, page, limit);
    } catch (error) {
      throw new GraphQLException(
        "Failed to search profile details",
        "INTERNAL_SERVER_ERROR"
      );
    }
  }
}
