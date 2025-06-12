import { Resolver, Query, Mutation, Args, Int } from "@nestjs/graphql";
import { AdditionAndDeductionService } from "./addtionAndDeduction.service";
import {
  CreatePayrollAdditionAndDeductionInput,
  UpdatePayrollAdditionAndDeductionInput,
  PayrollAdditionAndDeductionPaginatedResult,
} from "../dto/additionAndDeduction";
import { PayrollAdditionAndDeduction } from "../entities/payroll-addition-and-deduction.entity";
import { NotFoundException } from "@nestjs/common";
import { GraphQLException } from "exceptions/graphql-exception";

@Resolver(() => PayrollAdditionAndDeduction)
export class AdditionAndDeductionResolver {
  constructor(
    private readonly additionAndDeductionService: AdditionAndDeductionService
  ) {}

  @Mutation(() => PayrollAdditionAndDeduction)
  async createAdditionAndDeduction(
    @Args("createAdditionAndDeductionInput")
    createAdditionAndDeductionInput: CreatePayrollAdditionAndDeductionInput
  ): Promise<PayrollAdditionAndDeduction> {
    try {
      return await this.additionAndDeductionService.create(
        createAdditionAndDeductionInput
      );
    } catch (error) {
      throw new GraphQLException(
        "Failed to create addition/deduction",
        "INTERNAL_SERVER_ERROR"
      );
    }
  }

  @Query(() => PayrollAdditionAndDeductionPaginatedResult)
  async additionAndDeductions(
    @Args("page", { type: () => Int, nullable: true, defaultValue: 1 })
    page: number,
    @Args("limit", { type: () => Int, nullable: true, defaultValue: 10 })
    limit: number
  ): Promise<PayrollAdditionAndDeductionPaginatedResult> {
    try {
      return await this.additionAndDeductionService.findAll(page, limit);
    } catch (error) {
      throw new GraphQLException(
        "Failed to fetch addition/deduction records",
        "INTERNAL_SERVER_ERROR"
      );
    }
  }

  @Query(() => PayrollAdditionAndDeduction)
  async additionAndDeduction(
    @Args("id", { type: () => Int }) id: number
  ): Promise<PayrollAdditionAndDeduction> {
    try {
      return await this.additionAndDeductionService.findOne(id);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new GraphQLException(
          `Addition/Deduction record with ID ${id} not found`,
          "NOT_FOUND"
        );
      }
      throw new GraphQLException(
        "Failed to fetch addition/deduction record",
        "INTERNAL_SERVER_ERROR"
      );
    }
  }

  @Mutation(() => PayrollAdditionAndDeduction)
  async updateAdditionAndDeduction(
    @Args("id", { type: () => Int }) id: number,
    @Args("updateAdditionAndDeductionInput")
    updateAdditionAndDeductionInput: UpdatePayrollAdditionAndDeductionInput
  ): Promise<PayrollAdditionAndDeduction> {
    try {
      return await this.additionAndDeductionService.update(
        id,
        updateAdditionAndDeductionInput
      );
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new GraphQLException(
          `Addition/Deduction record with ID ${id} not found`,
          "NOT_FOUND"
        );
      }
      throw new GraphQLException(
        "Failed to update addition/deduction record",
        "INTERNAL_SERVER_ERROR"
      );
    }
  }

  @Mutation(() => PayrollAdditionAndDeduction)
  async removeAdditionAndDeduction(
    @Args("id", { type: () => Int }) id: number
  ): Promise<PayrollAdditionAndDeduction> {
    try {
      return await this.additionAndDeductionService.remove(id);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new GraphQLException(
          `Addition/Deduction record with ID ${id} not found`,
          "NOT_FOUND"
        );
      }
      throw new GraphQLException(
        "Failed to remove addition/deduction record",
        "INTERNAL_SERVER_ERROR"
      );
    }
  }

  @Query(() => PayrollAdditionAndDeductionPaginatedResult)
  async searchAdditionAndDeductions(
    @Args("query", { type: () => String }) query: string,
    @Args("page", { type: () => Int, nullable: true, defaultValue: 1 })
    page: number,
    @Args("limit", { type: () => Int, nullable: true, defaultValue: 10 })
    limit: number
  ): Promise<PayrollAdditionAndDeductionPaginatedResult> {
    try {
      return await this.additionAndDeductionService.search(query, page, limit);
    } catch (error) {
      throw new GraphQLException(
        "Failed to search addition/deduction records",
        "INTERNAL_SERVER_ERROR"
      );
    }
  }
}
