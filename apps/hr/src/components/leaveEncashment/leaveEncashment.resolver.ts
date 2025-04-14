import { Resolver, Query, Mutation, Args, Int } from "@nestjs/graphql";
import { LeaveEncashmentService } from "./leaveEncashment.service";
import {
  CreateLeaveEncashmentInput,
  UpdateLeaveEncashmentInput,
  LeaveEncashmentInputPaginatedResult,
} from "../dto/leaveEncashment.input";
import { NotFoundException } from "@nestjs/common";
import { GraphQLException } from "exceptions/graphql-exception";
import { LeaveEncashment } from "../entities/leaveEncashment.entity";

@Resolver(() => LeaveEncashment)
export class LeaveEncashmentResolver {
  constructor(
    private readonly leaveEncashmentService: LeaveEncashmentService
  ) {}

  @Mutation(() => LeaveEncashment)
  async createLeaveEncashment(
    @Args("createLeaveEncashmentInput")
    createLeaveEncashmentInput: CreateLeaveEncashmentInput
  ): Promise<LeaveEncashment> {
    try {
      return await this.leaveEncashmentService.create(
        createLeaveEncashmentInput
      );
    } catch (error) {
      throw new GraphQLException(
        "Failed to create leave encashment",
        "INTERNAL_SERVER_ERROR"
      );
    }
  }

  @Query(() => LeaveEncashmentInputPaginatedResult)
  async leaveEncashments(
    @Args("page", { type: () => Int, nullable: true, defaultValue: 1 })
    page: number,
    @Args("limit", { type: () => Int, nullable: true, defaultValue: 10 })
    limit: number
  ): Promise<LeaveEncashmentInputPaginatedResult> {
    try {
      return await this.leaveEncashmentService.findAll(page, limit);
    } catch (error) {
      throw new GraphQLException(
        "Failed to fetch leave encashments",
        "INTERNAL_SERVER_ERROR"
      );
    }
  }

  @Query(() => LeaveEncashment)
  async leaveEncashment(
    @Args("id", { type: () => Int }) id: number
  ): Promise<LeaveEncashment> {
    try {
      return await this.leaveEncashmentService.findOne(id);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new GraphQLException(
          `Leave encashment with ID ${id} not found`,
          "NOT_FOUND"
        );
      }
      throw new GraphQLException(
        "Failed to fetch leave encashment",
        "INTERNAL_SERVER_ERROR"
      );
    }
  }

  @Mutation(() => LeaveEncashment)
  async updateLeaveEncashment(
    @Args("id", { type: () => Int }) id: number,
    @Args("updateLeaveEncashmentInput")
    updateLeaveEncashmentInput: UpdateLeaveEncashmentInput
  ): Promise<LeaveEncashment> {
    try {
      return await this.leaveEncashmentService.update(
        id,
        updateLeaveEncashmentInput
      );
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new GraphQLException(
          `Leave encashment with ID ${id} not found`,
          "NOT_FOUND"
        );
      }
      throw new GraphQLException(
        "Failed to update leave encashment",
        "INTERNAL_SERVER_ERROR"
      );
    }
  }

  @Mutation(() => LeaveEncashment)
  async removeLeaveEncashment(
    @Args("id", { type: () => Int }) id: number
  ): Promise<LeaveEncashment> {
    try {
      return await this.leaveEncashmentService.remove(id);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new GraphQLException(
          `Leave encashment with ID ${id} not found`,
          "NOT_FOUND"
        );
      }
      throw new GraphQLException(
        "Failed to remove leave encashment",
        "INTERNAL_SERVER_ERROR"
      );
    }
  }

  @Query(() => LeaveEncashmentInputPaginatedResult)
  async searchLeaveEncashments(
    @Args("query", { type: () => String }) query: string,
    @Args("page", { type: () => Int, nullable: true, defaultValue: 1 })
    page: number,
    @Args("limit", { type: () => Int, nullable: true, defaultValue: 10 })
    limit: number
  ): Promise<LeaveEncashmentInputPaginatedResult> {
    try {
      return await this.leaveEncashmentService.search(query, page, limit);
    } catch (error) {
      throw new GraphQLException(
        "Failed to search leave encashments",
        "INTERNAL_SERVER_ERROR"
      );
    }
  }
}
