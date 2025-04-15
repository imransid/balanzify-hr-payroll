import { Resolver, Query, Mutation, Args, Int } from "@nestjs/graphql";
import { PayScheduleService } from "./paySchedule.service";
import {
  CreatePayScheduleInput,
  UpdatePayScheduleInput,
  PaySchedulePaginatedResult,
} from "../dto/paySchedule.input";
import { PaySchedule } from "../entities/paySchedule.entity";
import { NotFoundException } from "@nestjs/common";
import { GraphQLException } from "exceptions/graphql-exception";

@Resolver(() => PaySchedule)
export class PayScheduleResolver {
  constructor(private readonly payScheduleService: PayScheduleService) {}

  @Mutation(() => PaySchedule)
  async createPaySchedule(
    @Args("createPayScheduleInput")
    createPayScheduleInput: CreatePayScheduleInput
  ): Promise<PaySchedule> {
    try {
      return await this.payScheduleService.create(createPayScheduleInput);
    } catch (error) {
      throw new GraphQLException(
        "Failed to create pay schedule" + JSON.stringify(error),
        "INTERNAL_SERVER_ERROR"
      );
    }
  }

  @Query(() => PaySchedulePaginatedResult)
  async paySchedules(
    @Args("page", { type: () => Int, nullable: true, defaultValue: 1 })
    page: number,
    @Args("limit", { type: () => Int, nullable: true, defaultValue: 10 })
    limit: number
  ): Promise<PaySchedulePaginatedResult> {
    try {
      return await this.payScheduleService.findAll(page, limit);
    } catch (error) {
      throw new GraphQLException(
        "Failed to fetch pay schedules",
        "INTERNAL_SERVER_ERROR"
      );
    }
  }

  @Query(() => PaySchedule)
  async paySchedule(
    @Args("id", { type: () => Int }) id: number
  ): Promise<PaySchedule> {
    try {
      return await this.payScheduleService.findOne(id);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new GraphQLException(
          `PaySchedule with ID ${id} not found`,
          "NOT_FOUND"
        );
      }
      throw new GraphQLException(
        "Failed to fetch pay schedule",
        "INTERNAL_SERVER_ERROR"
      );
    }
  }

  @Mutation(() => PaySchedule)
  async updatePaySchedule(
    @Args("id", { type: () => Int }) id: number,
    @Args("updatePayScheduleInput")
    updatePayScheduleInput: UpdatePayScheduleInput
  ): Promise<PaySchedule> {
    try {
      return await this.payScheduleService.update(id, updatePayScheduleInput);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new GraphQLException(
          `PaySchedule with ID ${id} not found`,
          "NOT_FOUND"
        );
      }
      throw new GraphQLException(
        "Failed to update pay schedule",
        "INTERNAL_SERVER_ERROR"
      );
    }
  }

  @Mutation(() => PaySchedule)
  async removePaySchedule(
    @Args("id", { type: () => Int }) id: number
  ): Promise<PaySchedule> {
    try {
      return await this.payScheduleService.remove(id);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new GraphQLException(
          `PaySchedule with ID ${id} not found`,
          "NOT_FOUND"
        );
      }
      throw new GraphQLException(
        "Failed to remove pay schedule",
        "INTERNAL_SERVER_ERROR"
      );
    }
  }

  @Query(() => PaySchedulePaginatedResult)
  async searchPaySchedules(
    @Args("query", { type: () => String }) query: string,
    @Args("page", { type: () => Int, nullable: true, defaultValue: 1 })
    page: number,
    @Args("limit", { type: () => Int, nullable: true, defaultValue: 10 })
    limit: number
  ): Promise<PaySchedulePaginatedResult> {
    try {
      return await this.payScheduleService.search(query, page, limit);
    } catch (error) {
      throw new GraphQLException(
        "Failed to search pay schedules",
        "INTERNAL_SERVER_ERROR"
      );
    }
  }
}
