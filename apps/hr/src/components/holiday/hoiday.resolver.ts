import { Resolver, Query, Mutation, Args, Int } from "@nestjs/graphql";
import { HolidayService } from "./holiday.service";
import { CreateHolidayInput, UpdateHolidayInput } from "../dto/holiday.input";
import { Holiday } from "../entities/holiday.entity";
import { HolidayPaginatedResult } from "../dto/holiday.input";
import { NotFoundException } from "@nestjs/common";
import { GraphQLException } from "exceptions/graphql-exception";

@Resolver(() => Holiday)
export class HolidayResolver {
  constructor(private readonly holidayService: HolidayService) {}

  @Mutation(() => Holiday)
  async createHoliday(
    @Args("createHolidayInput") createHolidayInput: CreateHolidayInput
  ): Promise<Holiday> {
    try {
      return await this.holidayService.create(createHolidayInput);
    } catch (error) {
      throw new GraphQLException(
        "Failed to create holiday",
        "INTERNAL_SERVER_ERROR"
      );
    }
  }

  @Query(() => HolidayPaginatedResult)
  async holidays(
    @Args("page", { type: () => Int, nullable: true, defaultValue: 1 })
    page: number,
    @Args("limit", { type: () => Int, nullable: true, defaultValue: 10 })
    limit: number
  ): Promise<HolidayPaginatedResult> {
    try {
      return await this.holidayService.findAll(page, limit);
    } catch (error) {
      throw new GraphQLException(
        "Failed to fetch holidays",
        "INTERNAL_SERVER_ERROR"
      );
    }
  }

  @Query(() => Holiday)
  async holiday(@Args("id", { type: () => Int }) id: number): Promise<Holiday> {
    try {
      return await this.holidayService.findOne(id);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new GraphQLException(
          `Holiday with ID ${id} not found`,
          "NOT_FOUND"
        );
      }
      throw new GraphQLException(
        "Failed to fetch holiday",
        "INTERNAL_SERVER_ERROR"
      );
    }
  }

  @Mutation(() => Holiday)
  async updateHoliday(
    @Args("id", { type: () => Int }) id: number,
    @Args("updateHolidayInput") updateHolidayInput: UpdateHolidayInput
  ): Promise<Holiday> {
    try {
      return await this.holidayService.update(id, updateHolidayInput);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new GraphQLException(
          `Holiday with ID ${id} not found`,
          "NOT_FOUND"
        );
      }
      throw new GraphQLException(
        "Failed to update holiday",
        "INTERNAL_SERVER_ERROR"
      );
    }
  }

  @Mutation(() => Holiday)
  async removeHoliday(
    @Args("id", { type: () => Int }) id: number
  ): Promise<Holiday> {
    try {
      return await this.holidayService.remove(id);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new GraphQLException(
          `Holiday with ID ${id} not found`,
          "NOT_FOUND"
        );
      }
      throw new GraphQLException(
        "Failed to remove holiday",
        "INTERNAL_SERVER_ERROR"
      );
    }
  }

  @Query(() => HolidayPaginatedResult)
  async searchHolidays(
    @Args("query", { type: () => String }) query: string,
    @Args("page", { type: () => Int, nullable: true, defaultValue: 1 })
    page: number,
    @Args("limit", { type: () => Int, nullable: true, defaultValue: 10 })
    limit: number
  ): Promise<HolidayPaginatedResult> {
    try {
      return await this.holidayService.search(query, page, limit);
    } catch (error) {
      throw new GraphQLException(
        "Failed to search holidays",
        "INTERNAL_SERVER_ERROR"
      );
    }
  }
}
