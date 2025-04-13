import { Resolver, Query, Mutation, Args, Int } from "@nestjs/graphql";
import { ShiftService } from "./shift.service";
import {
  CreateShiftInput,
  UpdateShiftInput,
  ShiftPaginatedResult,
} from "../dto/shift.input";
import { Shift } from "../entities/shift.entity";
import { NotFoundException } from "@nestjs/common";
import { GraphQLException } from "exceptions/graphql-exception";

@Resolver(() => Shift)
export class ShiftResolver {
  constructor(private readonly shiftService: ShiftService) {}

  @Mutation(() => Shift)
  async createShift(
    @Args("createShiftInput")
    createShiftInput: CreateShiftInput
  ): Promise<Shift> {
    try {
      return await this.shiftService.create(createShiftInput);
    } catch (error) {
      throw new GraphQLException(
        "Failed to create shift",
        "INTERNAL_SERVER_ERROR"
      );
    }
  }

  @Query(() => ShiftPaginatedResult)
  async shifts(
    @Args("page", { type: () => Int, nullable: true, defaultValue: 1 })
    page: number,
    @Args("limit", { type: () => Int, nullable: true, defaultValue: 10 })
    limit: number
  ): Promise<ShiftPaginatedResult> {
    try {
      return await this.shiftService.findAll(page, limit);
    } catch (error) {
      throw new GraphQLException(
        "Failed to fetch shifts",
        "INTERNAL_SERVER_ERROR"
      );
    }
  }

  @Query(() => Shift)
  async shift(@Args("id", { type: () => Int }) id: number): Promise<Shift> {
    try {
      return await this.shiftService.findOne(id);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new GraphQLException(
          `Shift with ID ${id} not found`,
          "NOT_FOUND"
        );
      }
      throw new GraphQLException(
        "Failed to fetch shift",
        "INTERNAL_SERVER_ERROR"
      );
    }
  }

  @Mutation(() => Shift)
  async updateShift(
    @Args("id", { type: () => Int }) id: number,
    @Args("updateShiftInput")
    updateShiftInput: UpdateShiftInput
  ): Promise<Shift> {
    try {
      return await this.shiftService.update(id, updateShiftInput);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new GraphQLException(
          `Shift with ID ${id} not found`,
          "NOT_FOUND"
        );
      }
      throw new GraphQLException(
        "Failed to update shift",
        "INTERNAL_SERVER_ERROR"
      );
    }
  }

  @Mutation(() => Shift)
  async removeShift(
    @Args("id", { type: () => Int }) id: number
  ): Promise<Shift> {
    try {
      return await this.shiftService.remove(id);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new GraphQLException(
          `Shift with ID ${id} not found`,
          "NOT_FOUND"
        );
      }
      throw new GraphQLException(
        "Failed to remove shift",
        "INTERNAL_SERVER_ERROR"
      );
    }
  }

  @Query(() => ShiftPaginatedResult)
  async searchShifts(
    @Args("query", { type: () => String }) query: string,
    @Args("page", { type: () => Int, nullable: true, defaultValue: 1 })
    page: number,
    @Args("limit", { type: () => Int, nullable: true, defaultValue: 10 })
    limit: number
  ): Promise<ShiftPaginatedResult> {
    try {
      return await this.shiftService.search(query, page, limit);
    } catch (error) {
      throw new GraphQLException(
        "Failed to search shifts",
        "INTERNAL_SERVER_ERROR"
      );
    }
  }
}
