import { Resolver, Query, Mutation, Args, Int } from "@nestjs/graphql";
import { TimeSheetService } from "./timesheet.service";
import {
  CreateTimeSheetInput,
  UpdateTimeSheetInput,
  TimeSheetsPaginatedResult,
} from "../dto/timesheet.input";
import { TimeSheet } from "../entities/timesheet.entity";
import { NotFoundException } from "@nestjs/common";
import { GraphQLException } from "exceptions/graphql-exception";

@Resolver(() => TimeSheet)
export class TimeSheetResolver {
  constructor(private readonly timeSheetService: TimeSheetService) {}

  @Mutation(() => TimeSheet)
  async createTimeSheet(
    @Args("createTimeSheetInput")
    createTimeSheetInput: CreateTimeSheetInput
  ): Promise<TimeSheet> {
    try {
      return await this.timeSheetService.create(createTimeSheetInput);
    } catch (error) {
      throw new GraphQLException(
        "Failed to create timeSheet" + error.toString(),
        "INTERNAL_SERVER_ERROR"
      );
    }
  }

  @Query(() => TimeSheetsPaginatedResult)
  async timeSheets(
    @Args("page", { type: () => Int, nullable: true, defaultValue: 1 })
    page: number,
    @Args("limit", { type: () => Int, nullable: true, defaultValue: 10 })
    limit: number
  ): Promise<TimeSheetsPaginatedResult> {
    try {
      return await this.timeSheetService.findAll(page, limit);
    } catch (error) {
      throw new GraphQLException(
        "Failed to fetch time sheets" + error.toString(),
        "INTERNAL_SERVER_ERROR"
      );
    }
  }

  @Query(() => [TimeSheet])
  async timeSheet(
    @Args("id", { type: () => Int }) id: number,
    @Args("employeeId", { type: () => Int }) employeeId: number
  ): Promise<TimeSheet[]> {
    try {
      return await this.timeSheetService.findMany(id, employeeId);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new GraphQLException(
          `Time sheet with ID ${id} not found`,
          "NOT_FOUND"
        );
      }
      throw new GraphQLException(
        "Failed to fetch time sheet" + error.toString(),
        "INTERNAL_SERVER_ERROR"
      );
    }
  }

  @Mutation(() => TimeSheet)
  async updateTimeSheet(
    @Args("id", { type: () => Int }) id: number,
    @Args("updateTimeSheetInput") updateTimeSheetInput: UpdateTimeSheetInput
  ): Promise<TimeSheet> {
    try {
      return await this.timeSheetService.update(id, updateTimeSheetInput);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new GraphQLException(
          `Time sheet with ID ${id} not found`,
          "NOT_FOUND"
        );
      }
      throw new GraphQLException(
        "Failed to update time sheet" + error.toString(),
        "INTERNAL_SERVER_ERROR"
      );
    }
  }

  @Mutation(() => TimeSheet)
  async removeTimeSheet(
    @Args("id", { type: () => Int }) id: number
  ): Promise<TimeSheet> {
    try {
      return await this.timeSheetService.remove(id);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new GraphQLException(
          `Time sheet with ID ${id} not found`,
          "NOT_FOUND"
        );
      }
      throw new GraphQLException(
        "Failed to remove time sheet" + error.toString(),
        "INTERNAL_SERVER_ERROR"
      );
    }
  }

  @Query(() => TimeSheetsPaginatedResult)
  async searchTimeSheets(
    @Args("query", { type: () => String }) query: string,
    @Args("page", { type: () => Int, nullable: true, defaultValue: 1 })
    page: number,
    @Args("limit", { type: () => Int, nullable: true, defaultValue: 10 })
    limit: number
  ): Promise<TimeSheetsPaginatedResult> {
    try {
      return await this.timeSheetService.search(query, page, limit);
    } catch (error) {
      throw new GraphQLException(
        "Failed to search time sheets" + error.toString(),
        "INTERNAL_SERVER_ERROR"
      );
    }
  }
}
