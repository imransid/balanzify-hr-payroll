import { Resolver, Query, Mutation, Args, Int } from "@nestjs/graphql";
import { LeaveService } from "./leave.service";
import {
  CreateEmployeeLeaveInput,
  UpdateEmployeeLeaveInput,
} from "../dto/leave.input";
import { EmployeeLeave } from "../entities/leave.entity";
import { LeavePaginatedResult } from "../dto/leave.input";
import { NotFoundException } from "@nestjs/common";
import { GraphQLException } from "exceptions/graphql-exception";

@Resolver(() => EmployeeLeave)
export class LeaveResolver {
  constructor(private readonly leaveService: LeaveService) {}

  @Mutation(() => EmployeeLeave)
  async createLeave(
    @Args("createLeaveInput") createLeaveInput: CreateEmployeeLeaveInput
  ): Promise<EmployeeLeave> {
    try {
      return await this.leaveService.create(createLeaveInput);
    } catch (error) {
      throw new GraphQLException(
        "Failed to create leave",
        "INTERNAL_SERVER_ERROR"
      );
    }
  }

  @Query(() => LeavePaginatedResult)
  async leaves(
    @Args("page", { type: () => Int, nullable: true, defaultValue: 1 })
    page: number,
    @Args("limit", { type: () => Int, nullable: true, defaultValue: 10 })
    limit: number,
    @Args("companyId", { type: () => String }) companyId: string
  ): Promise<LeavePaginatedResult> {
    try {
      return await this.leaveService.findAll(page, limit, companyId);
    } catch (error) {
      throw new GraphQLException(
        "Failed to fetch leaves",
        "INTERNAL_SERVER_ERROR"
      );
    }
  }

  @Mutation(() => EmployeeLeave)
  async updateLeave(
    @Args("id", { type: () => Int }) id: number,
    @Args("updateLeaveInput") updateLeaveInput: UpdateEmployeeLeaveInput
  ): Promise<EmployeeLeave> {
    try {
      return await this.leaveService.update(id, updateLeaveInput);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new GraphQLException(
          `Leave with ID ${id} not found`,
          "NOT_FOUND"
        );
      }
      throw new GraphQLException(
        "Failed to update leave",
        "INTERNAL_SERVER_ERROR"
      );
    }
  }
}
