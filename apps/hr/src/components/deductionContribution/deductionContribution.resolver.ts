import { Resolver, Query, Mutation, Args, Int } from "@nestjs/graphql";
import { DeductionContributionService } from "./deductionContribution.service";
import {
  CreateDeductionContributionInput,
  UpdateDeductionContributionInput,
  DeductionContributionPaginatedResult,
} from "../dto/deductionContribution.input";
import { DeductionContribution } from "../entities/deductionContribution.entity";
import { NotFoundException } from "@nestjs/common";
import { GraphQLException } from "exceptions/graphql-exception";

@Resolver(() => DeductionContribution)
export class DeductionContributionResolver {
  constructor(
    private readonly deductionContributionService: DeductionContributionService
  ) {}

  @Mutation(() => DeductionContribution)
  async createDeductionContribution(
    @Args("createDeductionContributionInput")
    createDeductionContributionInput: CreateDeductionContributionInput
  ): Promise<DeductionContribution> {
    try {
      return await this.deductionContributionService.create(
        createDeductionContributionInput
      );
    } catch (error) {
      throw new GraphQLException(
        "Failed to create DeductionContribution",
        "INTERNAL_SERVER_ERROR"
      );
    }
  }

  @Query(() => DeductionContributionPaginatedResult)
  async deductionContributions(
    @Args("page", { type: () => Int, nullable: true, defaultValue: 1 })
    page: number,
    @Args("limit", { type: () => Int, nullable: true, defaultValue: 10 })
    limit: number,
    @Args("companyId", { type: () => String }) companyId: string
  ): Promise<DeductionContributionPaginatedResult> {
    try {
      return await this.deductionContributionService.findAll(
        page,
        limit,
        companyId
      );
    } catch (error) {
      throw new GraphQLException(
        "Failed to fetch DeductionContributions",
        "INTERNAL_SERVER_ERROR"
      );
    }
  }

  @Query(() => DeductionContribution)
  async deductionContribution(
    @Args("id", { type: () => Int }) id: number
  ): Promise<DeductionContribution> {
    try {
      return await this.deductionContributionService.findOne(id);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new GraphQLException(
          `DeductionContribution with ID ${id} not found`,
          "NOT_FOUND"
        );
      }
      throw new GraphQLException(
        "Failed to fetch DeductionContribution",
        "INTERNAL_SERVER_ERROR"
      );
    }
  }

  @Mutation(() => DeductionContribution)
  async updateDeductionContribution(
    @Args("id", { type: () => Int }) id: number,
    @Args("updateDeductionContributionInput")
    updateDeductionContributionInput: UpdateDeductionContributionInput
  ): Promise<DeductionContribution> {
    try {
      return await this.deductionContributionService.update(
        id,
        updateDeductionContributionInput
      );
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new GraphQLException(
          `DeductionContribution with ID ${id} not found`,
          "NOT_FOUND"
        );
      }
      throw new GraphQLException(
        "Failed to update DeductionContribution",
        "INTERNAL_SERVER_ERROR"
      );
    }
  }

  @Mutation(() => DeductionContribution)
  async removeDeductionContribution(
    @Args("id", { type: () => Int }) id: number
  ): Promise<DeductionContribution> {
    try {
      return await this.deductionContributionService.remove(id);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new GraphQLException(
          `DeductionContribution with ID ${id} not found`,
          "NOT_FOUND"
        );
      }
      throw new GraphQLException(
        "Failed to remove DeductionContribution",
        "INTERNAL_SERVER_ERROR"
      );
    }
  }

  @Query(() => DeductionContributionPaginatedResult)
  async searchDeductionContributions(
    @Args("query", { type: () => String }) query: string,
    @Args("companyId", { type: () => String }) companyId: string,
    @Args("page", { type: () => Int, nullable: true, defaultValue: 1 })
    page: number,
    @Args("limit", { type: () => Int, nullable: true, defaultValue: 10 })
    limit: number
  ): Promise<DeductionContributionPaginatedResult> {
    try {
      return await this.deductionContributionService.search(
        query,
        companyId,
        page,
        limit
      );
    } catch (error) {
      throw new GraphQLException(
        "Failed to search DeductionContributions",
        "INTERNAL_SERVER_ERROR"
      );
    }
  }
}
