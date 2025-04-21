import { Resolver, Query, Mutation, Args, Int } from "@nestjs/graphql";
import { GeneralSettingsService } from "./generalSettings.service";
import {
  CreateGeneralSettingsInput,
  UpdateGeneralSettingsInput,
} from "../dto/general-settings.input";
import { GeneralSettings } from "../entities/generalSettings.entity";
import { GeneralSettingsPaginatedResult } from "../dto/general-settings.input";
import { NotFoundException } from "@nestjs/common";
import { GraphQLException } from "exceptions/graphql-exception";

@Resolver(() => GeneralSettings)
export class GeneralSettingsResolver {
  constructor(
    private readonly generalSettingsService: GeneralSettingsService
  ) {}

  @Mutation(() => GeneralSettings)
  async createGeneralSettings(
    @Args("createGeneralSettingsInput")
    createGeneralSettingsInput: CreateGeneralSettingsInput
  ): Promise<GeneralSettings> {
    try {
      return await this.generalSettingsService.create(
        createGeneralSettingsInput
      );
    } catch (error) {
      throw new GraphQLException(
        "Failed to create general settings",
        "INTERNAL_SERVER_ERROR"
      );
    }
  }

  @Query(() => GeneralSettingsPaginatedResult)
  async generalSettingsList(
    @Args("page", { type: () => Int, nullable: true, defaultValue: 1 })
    page: number,
    @Args("limit", { type: () => Int, nullable: true, defaultValue: 10 })
    limit: number
  ): Promise<GeneralSettingsPaginatedResult> {
    try {
      return await this.generalSettingsService.findAll(page, limit);
    } catch (error) {
      throw new GraphQLException(
        "Failed to fetch general settings",
        "INTERNAL_SERVER_ERROR"
      );
    }
  }

  @Query(() => GeneralSettings)
  async generalSettings(
    @Args("id", { type: () => Int }) id: number
  ): Promise<GeneralSettings> {
    try {
      return await this.generalSettingsService.findOne(id);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new GraphQLException(
          `GeneralSettings with ID ${id} not found`,
          "NOT_FOUND"
        );
      }
      throw new GraphQLException(
        "Failed to fetch general settings",
        "INTERNAL_SERVER_ERROR"
      );
    }
  }

  @Mutation(() => GeneralSettings)
  async updateGeneralSettings(
    @Args("id", { type: () => Int }) id: number,
    @Args("updateGeneralSettingsInput")
    updateGeneralSettingsInput: UpdateGeneralSettingsInput
  ): Promise<GeneralSettings> {
    try {
      return await this.generalSettingsService.update(
        id,
        updateGeneralSettingsInput
      );
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new GraphQLException(
          `GeneralSettings with ID ${id} not found`,
          "NOT_FOUND"
        );
      }
      throw new GraphQLException(
        "Failed to update general settings",
        "INTERNAL_SERVER_ERROR"
      );
    }
  }

  @Mutation(() => GeneralSettings)
  async removeGeneralSettings(
    @Args("id", { type: () => Int }) id: number
  ): Promise<GeneralSettings> {
    try {
      return await this.generalSettingsService.remove(id);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new GraphQLException(
          `GeneralSettings with ID ${id} not found`,
          "NOT_FOUND"
        );
      }
      throw new GraphQLException(
        "Failed to remove general settings",
        "INTERNAL_SERVER_ERROR"
      );
    }
  }

  @Query(() => GeneralSettingsPaginatedResult)
  async searchGeneralSettings(
    @Args("query", { type: () => String }) query: string,
    @Args("page", { type: () => Int, nullable: true, defaultValue: 1 })
    page: number,
    @Args("limit", { type: () => Int, nullable: true, defaultValue: 10 })
    limit: number
  ): Promise<GeneralSettingsPaginatedResult> {
    try {
      return await this.generalSettingsService.search(query, page, limit);
    } catch (error) {
      throw new GraphQLException(
        "Failed to search general settings",
        "INTERNAL_SERVER_ERROR"
      );
    }
  }
}
