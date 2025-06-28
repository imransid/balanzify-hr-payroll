import { Resolver, Query, Mutation, Args, Int } from "@nestjs/graphql";
import { LeaveTypeService } from "./leaveType.service";
import {
  CreateLeaveTypeInput,
  UpdateLeaveTypeInput,
  LeaveTypePaginatedResult,
} from "../dto/leaveType.input";
import { LeaveType } from "../entities/leaveType.entity";
import { NotFoundException } from "@nestjs/common";
import { GraphQLException } from "exceptions/graphql-exception";

@Resolver(() => LeaveType)
export class LeaveTypeResolver {
  constructor(private readonly leaveTypeService: LeaveTypeService) {}

  @Mutation(() => LeaveType)
  async createLeaveType(
    @Args("createLeaveTypeInput") createLeaveTypeInput: CreateLeaveTypeInput
  ): Promise<LeaveType> {
    try {
      return await this.leaveTypeService.create(createLeaveTypeInput);
    } catch (error) {
      throw new GraphQLException(
        "Failed to create leave type",
        "INTERNAL_SERVER_ERROR"
      );
    }
  }

  @Query(() => LeaveTypePaginatedResult)
  async leaveTypes(
    @Args("companyId", { type: () => String }) companyId: string,
    @Args("page", { type: () => Int, nullable: true, defaultValue: 1 })
    page: number,
    @Args("limit", { type: () => Int, nullable: true, defaultValue: 10 })
    limit: number
  ): Promise<LeaveTypePaginatedResult> {
    try {
      return await this.leaveTypeService.findAll(page, limit, companyId);
    } catch (error) {
      throw new GraphQLException(
        "Failed to fetch leave types",
        "INTERNAL_SERVER_ERROR"
      );
    }
  }

  @Query(() => LeaveType)
  async leaveType(
    @Args("id", { type: () => Int }) id: number
  ): Promise<LeaveType> {
    try {
      return await this.leaveTypeService.findOne(id);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new GraphQLException(
          `Leave type with ID ${id} not found`,
          "NOT_FOUND"
        );
      }
      throw new GraphQLException(
        "Failed to fetch leave type",
        "INTERNAL_SERVER_ERROR"
      );
    }
  }

  @Mutation(() => LeaveType)
  async updateLeaveType(
    @Args("id", { type: () => Int }) id: number,
    @Args("updateLeaveTypeInput") updateLeaveTypeInput: UpdateLeaveTypeInput
  ): Promise<LeaveType> {
    try {
      return await this.leaveTypeService.update(id, updateLeaveTypeInput);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new GraphQLException(
          `Leave type with ID ${id} not found`,
          "NOT_FOUND"
        );
      }
      throw new GraphQLException(
        "Failed to update leave type",
        "INTERNAL_SERVER_ERROR"
      );
    }
  }

  @Mutation(() => LeaveType)
  async removeLeaveType(
    @Args("id", { type: () => Int }) id: number
  ): Promise<LeaveType> {
    try {
      return await this.leaveTypeService.remove(id);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new GraphQLException(
          `Leave type with ID ${id} not found`,
          "NOT_FOUND"
        );
      }
      throw new GraphQLException(
        "Failed to remove leave type",
        "INTERNAL_SERVER_ERROR"
      );
    }
  }

  @Query(() => LeaveTypePaginatedResult)
  async searchLeaveTypes(
    @Args("companyId", { type: () => String }) companyId: string,
    @Args("query", { type: () => String }) query: string,
    @Args("page", { type: () => Int, nullable: true, defaultValue: 1 })
    page: number,
    @Args("limit", { type: () => Int, nullable: true, defaultValue: 10 })
    limit: number
  ): Promise<LeaveTypePaginatedResult> {
    try {
      return await this.leaveTypeService.search(query, companyId, page, limit);
    } catch (error) {
      throw new GraphQLException(
        "Failed to search leave types",
        "INTERNAL_SERVER_ERROR"
      );
    }
  }
}
