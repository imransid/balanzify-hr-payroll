import { Resolver, Query, Mutation, Args, Int } from "@nestjs/graphql";

import { LeaveBalanceDetails } from "../entities/leave-balance-details.entity";
import { NotFoundException } from "@nestjs/common";
import { GraphQLException } from "exceptions/graphql-exception";
import {
  LeaveBalanceDetailsPaginatedResult,
  UpdateLeaveBalanceDetailsInput,
} from "../dto/leaveBalanceDetails.input";
import { LeaveBalanceDetailsService } from "./leaveBalanceDetails.service";

@Resolver(() => LeaveBalanceDetails)
export class LeaveBalanceDetailsResolver {
  constructor(
    private readonly leaveBalanceDetailsService: LeaveBalanceDetailsService
  ) {}

  @Query(() => LeaveBalanceDetailsPaginatedResult)
  async leaveBalanceDetailsList(
    @Args("page", { type: () => Int, nullable: true, defaultValue: 1 })
    page: number,
    @Args("limit", { type: () => Int, nullable: true, defaultValue: 10 })
    limit: number
  ): Promise<LeaveBalanceDetailsPaginatedResult> {
    try {
      return await this.leaveBalanceDetailsService.findAll(page, limit);
    } catch (error) {
      throw new GraphQLException(
        "Failed to fetch leave balance details" + error.toString(),
        "INTERNAL_SERVER_ERROR"
      );
    }
  }

  @Query(() => LeaveBalanceDetails)
  async leaveBalanceDetail(
    @Args("id", { type: () => Int }) id: number
  ): Promise<LeaveBalanceDetails> {
    try {
      return await this.leaveBalanceDetailsService.findOne(id);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new GraphQLException(
          `Leave balance detail with ID ${id} not found`,
          "NOT_FOUND"
        );
      }
      throw new GraphQLException(
        "Failed to fetch leave balance detail",
        "INTERNAL_SERVER_ERROR"
      );
    }
  }

  @Mutation(() => LeaveBalanceDetails)
  async updateLeaveBalanceDetails(
    @Args("id", { type: () => Int }) id: number,
    @Args("updateLeaveBalanceDetailsInput")
    updateLeaveBalanceDetailsInput: UpdateLeaveBalanceDetailsInput
  ): Promise<LeaveBalanceDetails> {
    try {
      return await this.leaveBalanceDetailsService.update(
        id,
        updateLeaveBalanceDetailsInput
      );
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new GraphQLException(
          `Leave balance detail with ID ${id} not found`,
          "NOT_FOUND"
        );
      }
      throw new GraphQLException(
        "Failed to update leave balance detail",
        "INTERNAL_SERVER_ERROR"
      );
    }
  }

  @Mutation(() => LeaveBalanceDetails)
  async removeLeaveBalanceDetails(
    @Args("id", { type: () => Int }) id: number
  ): Promise<LeaveBalanceDetails> {
    try {
      return await this.leaveBalanceDetailsService.remove(id);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new GraphQLException(
          `Leave balance detail with ID ${id} not found`,
          "NOT_FOUND"
        );
      }
      throw new GraphQLException(
        "Failed to remove leave balance detail",
        "INTERNAL_SERVER_ERROR"
      );
    }
  }

  @Query(() => LeaveBalanceDetailsPaginatedResult)
  async searchLeaveBalanceDetails(
    @Args("query", { type: () => String }) query: string,
    @Args("page", { type: () => Int, nullable: true, defaultValue: 1 })
    page: number,
    @Args("limit", { type: () => Int, nullable: true, defaultValue: 10 })
    limit: number
  ): Promise<LeaveBalanceDetailsPaginatedResult> {
    try {
      return await this.leaveBalanceDetailsService.search(query, page, limit);
    } catch (error) {
      throw new GraphQLException(
        "Failed to search leave balance details",
        "INTERNAL_SERVER_ERROR"
      );
    }
  }
}
