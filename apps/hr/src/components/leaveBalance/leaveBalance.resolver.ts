import { Resolver, Query, Mutation, Args, Int } from "@nestjs/graphql";
import { LeaveBalanceService } from "./leaveBalance.service";
import {
  CreateLeaveBalanceInput,
  UpdateLeaveBalanceInput,
  LeaveBalancePaginatedResult,
} from "../dto/leaveBalance.input";
import { LeaveBalance } from "../entities/leaveBalance.entity";
import { NotFoundException } from "@nestjs/common";
import { GraphQLException } from "exceptions/graphql-exception";

@Resolver(() => LeaveBalance)
export class LeaveBalanceResolver {
  constructor(private readonly leaveBalanceService: LeaveBalanceService) {}

  @Mutation(() => LeaveBalance)
  async createLeaveBalance(
    @Args("createLeaveBalanceInput")
    createLeaveBalanceInput: CreateLeaveBalanceInput
  ): Promise<LeaveBalance> {
    try {
      return await this.leaveBalanceService.create(createLeaveBalanceInput);
    } catch (error) {
      throw new GraphQLException(
        "Failed to create leave balance",
        "INTERNAL_SERVER_ERROR"
      );
    }
  }

  @Query(() => LeaveBalancePaginatedResult)
  async leaveBalances(
    @Args("page", { type: () => Int, nullable: true, defaultValue: 1 })
    page: number,
    @Args("limit", { type: () => Int, nullable: true, defaultValue: 10 })
    limit: number
  ): Promise<LeaveBalancePaginatedResult> {
    try {
      return await this.leaveBalanceService.findAll(page, limit);
    } catch (error) {
      throw new GraphQLException(
        "Failed to fetch leave balances",
        "INTERNAL_SERVER_ERROR"
      );
    }
  }

  @Query(() => LeaveBalance)
  async leaveBalance(
    @Args("id", { type: () => Int }) id: number
  ): Promise<LeaveBalance> {
    try {
      return await this.leaveBalanceService.findOne(id);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new GraphQLException(
          `Leave balance with ID ${id} not found`,
          "NOT_FOUND"
        );
      }
      throw new GraphQLException(
        "Failed to fetch leave balance",
        "INTERNAL_SERVER_ERROR"
      );
    }
  }

  @Mutation(() => LeaveBalance)
  async updateLeaveBalance(
    @Args("id", { type: () => Int }) id: number,
    @Args("updateLeaveBalanceInput")
    updateLeaveBalanceInput: UpdateLeaveBalanceInput
  ): Promise<LeaveBalance> {
    try {
      return await this.leaveBalanceService.update(id, updateLeaveBalanceInput);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new GraphQLException(
          `Leave balance with ID ${id} not found`,
          "NOT_FOUND"
        );
      }
      throw new GraphQLException(
        "Failed to update leave balance",
        "INTERNAL_SERVER_ERROR"
      );
    }
  }

  @Mutation(() => LeaveBalance)
  async removeLeaveBalance(
    @Args("id", { type: () => Int }) id: number
  ): Promise<LeaveBalance> {
    try {
      return await this.leaveBalanceService.remove(id);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new GraphQLException(
          `Leave balance with ID ${id} not found`,
          "NOT_FOUND"
        );
      }
      throw new GraphQLException(
        "Failed to remove leave balance",
        "INTERNAL_SERVER_ERROR"
      );
    }
  }

  @Query(() => LeaveBalancePaginatedResult)
  async searchLeaveBalances(
    @Args("query", { type: () => String, nullable: true }) query?: string,
    @Args("page", { type: () => Int, nullable: true, defaultValue: 1 })
    page?: number,
    @Args("limit", { type: () => Int, nullable: true, defaultValue: 10 })
    limit?: number
  ): Promise<LeaveBalancePaginatedResult> {
    try {
      return await this.leaveBalanceService.search(
        query ?? "",
        page ?? 1,
        limit ?? 10
      );
    } catch (error) {
      throw new GraphQLException(
        "Failed to search leave balances",
        "INTERNAL_SERVER_ERROR"
      );
    }
  }
}
