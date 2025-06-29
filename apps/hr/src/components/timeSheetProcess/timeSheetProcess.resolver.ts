import { Resolver, Query, Mutation, Args, Int } from "@nestjs/graphql";
import { TimeSheetProcessService } from "./timeSheetProcess.service";
import {
  CreateTimeSheetProcessInput,
  UpdateTimeSheetProcessInput,
  TimeSheetProcessPaginatedResult,
} from "../dto/create-time-sheet-process.input";
import { TimeSheetProcess } from "../entities/timeSheetProcess.entity";
import { NotFoundException } from "@nestjs/common";
import { GraphQLException } from "exceptions/graphql-exception";

@Resolver(() => TimeSheetProcess)
export class TimeSheetProcessResolver {
  constructor(
    private readonly timeSheetProcessService: TimeSheetProcessService
  ) {}

  @Mutation(() => [TimeSheetProcess])
  async createTimeSheetProcess(
    @Args("createTimeSheetProcessInput")
    input: CreateTimeSheetProcessInput
  ): Promise<TimeSheetProcess[]> {
    try {
      return await this.timeSheetProcessService.create(input);
    } catch (error) {
      throw new GraphQLException(
        "Failed to create time sheet process",
        "INTERNAL_SERVER_ERROR"
      );
    }
  }

  @Query(() => TimeSheetProcessPaginatedResult)
  async timeSheetProcesses(
    @Args("page", { type: () => Int, nullable: true, defaultValue: 1 })
    page: number,
    @Args("limit", { type: () => Int, nullable: true, defaultValue: 10 })
    limit: number,
    @Args("companyId", { type: () => String }) companyId: string
  ): Promise<TimeSheetProcessPaginatedResult> {
    try {
      return await this.timeSheetProcessService.findAll(page, limit, companyId);
    } catch (error) {
      throw new GraphQLException(
        "Failed to fetch time sheet processes",
        "INTERNAL_SERVER_ERROR"
      );
    }
  }

  @Query(() => TimeSheetProcess)
  async timeSheetProcess(
    @Args("id", { type: () => Int }) id: number
  ): Promise<TimeSheetProcess> {
    try {
      return await this.timeSheetProcessService.findOne(id);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new GraphQLException(
          `TimeSheetProcess with ID ${id} not found`,
          "NOT_FOUND"
        );
      }
      throw new GraphQLException(
        "Failed to fetch time sheet process",
        "INTERNAL_SERVER_ERROR"
      );
    }
  }

  @Mutation(() => TimeSheetProcess)
  async updateTimeSheetProcess(
    @Args("id", { type: () => Int }) id: number,
    @Args("updateTimeSheetProcessInput") input: UpdateTimeSheetProcessInput
  ): Promise<TimeSheetProcess> {
    try {
      return await this.timeSheetProcessService.update(id, input);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new GraphQLException(
          `TimeSheetProcess with ID ${id} not found`,
          "NOT_FOUND"
        );
      }
      throw new GraphQLException(
        "Failed to update time sheet process",
        "INTERNAL_SERVER_ERROR"
      );
    }
  }

  @Mutation(() => TimeSheetProcess)
  async removeTimeSheetProcess(
    @Args("id", { type: () => Int }) id: number
  ): Promise<TimeSheetProcess> {
    try {
      return await this.timeSheetProcessService.remove(id);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new GraphQLException(
          `TimeSheetProcess with ID ${id} not found`,
          "NOT_FOUND"
        );
      }
      throw new GraphQLException(
        "Failed to remove time sheet process",
        "INTERNAL_SERVER_ERROR"
      );
    }
  }

  @Query(() => TimeSheetProcessPaginatedResult)
  async searchTimeSheetProcesses(
    @Args("query", { type: () => String }) query: string,
    @Args("page", { type: () => Int, nullable: true, defaultValue: 1 })
    page: number,
    @Args("limit", { type: () => Int, nullable: true, defaultValue: 10 })
    limit: number,
    @Args("companyId", { type: () => String }) companyId: string
  ): Promise<TimeSheetProcessPaginatedResult> {
    try {
      return await this.timeSheetProcessService.search(
        query,
        companyId,
        page,
        limit
      );
    } catch (error) {
      throw new GraphQLException(
        "Failed to search time sheet processes",
        "INTERNAL_SERVER_ERROR"
      );
    }
  }
}
