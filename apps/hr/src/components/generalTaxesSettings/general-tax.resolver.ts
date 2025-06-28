import { Resolver, Query, Mutation, Args, Int } from "@nestjs/graphql";
import { GeneralTaxService } from "./general-tax.service";
import {
  CreateGeneralTaxInput,
  UpdateGeneralTaxInput,
  GeneralTaxPaginatedResult,
} from "../dto/generalTax.input";
import { GeneralTax } from "../entities/general-tax.entity";
import { NotFoundException } from "@nestjs/common";
import { GraphQLException } from "exceptions/graphql-exception";

// companyId

@Resolver(() => GeneralTax)
export class GeneralTaxResolver {
  constructor(private readonly generalTaxService: GeneralTaxService) {}

  @Mutation(() => GeneralTax)
  async createGeneralTax(
    @Args("createGeneralTaxInput") createGeneralTaxInput: CreateGeneralTaxInput
  ): Promise<GeneralTax> {
    try {
      return await this.generalTaxService.create(createGeneralTaxInput);
    } catch (error) {
      throw new GraphQLException(
        "Failed to create general tax",
        "INTERNAL_SERVER_ERROR"
      );
    }
  }

  @Query(() => GeneralTaxPaginatedResult)
  async generalTaxes(
    @Args("page", { type: () => Int, nullable: true, defaultValue: 1 })
    page: number,
    @Args("limit", { type: () => Int, nullable: true, defaultValue: 10 })
    limit: number,
    @Args("companyId", { type: () => String }) companyId: string
  ): Promise<GeneralTaxPaginatedResult> {
    try {
      return await this.generalTaxService.findAll(page, limit, companyId);
    } catch (error) {
      throw new GraphQLException(
        "Failed to fetch general taxes",
        "INTERNAL_SERVER_ERROR"
      );
    }
  }

  @Query(() => GeneralTax)
  async generalTax(
    @Args("id", { type: () => Int }) id: number
  ): Promise<GeneralTax> {
    try {
      return await this.generalTaxService.findOne(id);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new GraphQLException(
          `GeneralTax with ID ${id} not found`,
          "NOT_FOUND"
        );
      }
      throw new GraphQLException(
        "Failed to fetch general tax",
        "INTERNAL_SERVER_ERROR"
      );
    }
  }

  @Mutation(() => GeneralTax)
  async updateGeneralTax(
    @Args("id", { type: () => Int }) id: number,
    @Args("updateGeneralTaxInput") updateGeneralTaxInput: UpdateGeneralTaxInput
  ): Promise<GeneralTax> {
    try {
      return await this.generalTaxService.update(id, updateGeneralTaxInput);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new GraphQLException(
          `GeneralTax with ID ${id} not found`,
          "NOT_FOUND"
        );
      }
      throw new GraphQLException(
        "Failed to update general tax",
        "INTERNAL_SERVER_ERROR"
      );
    }
  }

  @Mutation(() => GeneralTax)
  async removeGeneralTax(
    @Args("id", { type: () => Int }) id: number
  ): Promise<GeneralTax> {
    try {
      return await this.generalTaxService.remove(id);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new GraphQLException(
          `GeneralTax with ID ${id} not found`,
          "NOT_FOUND"
        );
      }
      throw new GraphQLException(
        "Failed to remove general tax",
        "INTERNAL_SERVER_ERROR"
      );
    }
  }

  @Query(() => GeneralTaxPaginatedResult)
  async searchGeneralTaxes(
    @Args("query", { type: () => String }) query: string,
    @Args("page", { type: () => Int, nullable: true, defaultValue: 1 })
    page: number,
    @Args("limit", { type: () => Int, nullable: true, defaultValue: 10 })
    limit: number,
    @Args("companyId", { type: () => String }) companyId: string
  ): Promise<GeneralTaxPaginatedResult> {
    try {
      return await this.generalTaxService.search(query, companyId, page, limit);
    } catch (error) {
      throw new GraphQLException(
        "Failed to search general taxes",
        "INTERNAL_SERVER_ERROR"
      );
    }
  }
}
