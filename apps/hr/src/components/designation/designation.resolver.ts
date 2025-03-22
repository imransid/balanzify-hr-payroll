import { Resolver, Query, Mutation, Args, Int } from "@nestjs/graphql";
import { DesignationService } from "./designation.service";
import {
  CreateDesignationInput,
  UpdateDesignationInput,
  DesignationsPaginatedResult,
} from "../dto/designation.input";
import { Designation } from "../entities/designation.entity";
import { NotFoundException } from "@nestjs/common";
import { GraphQLException } from "exceptions/graphql-exception";

@Resolver(() => Designation)
export class DesignationResolver {
  constructor(private readonly designationService: DesignationService) {}

  @Mutation(() => Designation)
  async createDesignation(
    @Args("createDesignationInput")
    createDesignationInput: CreateDesignationInput
  ): Promise<Designation> {
    try {
      return await this.designationService.create(createDesignationInput);
    } catch (error) {
      throw new GraphQLException(
        "Failed to create designation",
        "INTERNAL_SERVER_ERROR"
      );
    }
  }

  @Query(() => DesignationsPaginatedResult)
  async designations(
    @Args("page", { type: () => Int, nullable: true, defaultValue: 1 })
    page: number,
    @Args("limit", { type: () => Int, nullable: true, defaultValue: 10 })
    limit: number
  ): Promise<DesignationsPaginatedResult> {
    try {
      return await this.designationService.findAll(page, limit);
    } catch (error) {
      throw new GraphQLException(
        "Failed to fetch designations",
        "INTERNAL_SERVER_ERROR"
      );
    }
  }

  @Query(() => Designation)
  async designation(
    @Args("id", { type: () => Int }) id: number
  ): Promise<Designation> {
    try {
      return await this.designationService.findOne(id);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new GraphQLException(
          `Designation with ID ${id} not found`,
          "NOT_FOUND"
        );
      }
      throw new GraphQLException(
        "Failed to fetch designation",
        "INTERNAL_SERVER_ERROR"
      );
    }
  }

  @Mutation(() => Designation)
  async updateDesignation(
    @Args("id", { type: () => Int }) id: number,
    @Args("updateDesignationInput")
    updateDesignationInput: UpdateDesignationInput
  ): Promise<Designation> {
    try {
      return await this.designationService.update(id, updateDesignationInput);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new GraphQLException(
          `Designation with ID ${id} not found`,
          "NOT_FOUND"
        );
      }
      throw new GraphQLException(
        "Failed to update designation",
        "INTERNAL_SERVER_ERROR"
      );
    }
  }

  @Mutation(() => Designation)
  async removeDesignation(
    @Args("id", { type: () => Int }) id: number
  ): Promise<Designation> {
    try {
      return await this.designationService.remove(id);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new GraphQLException(
          `Designation with ID ${id} not found`,
          "NOT_FOUND"
        );
      }
      throw new GraphQLException(
        "Failed to remove designation",
        "INTERNAL_SERVER_ERROR"
      );
    }
  }

  @Query(() => DesignationsPaginatedResult)
  async searchDesignations(
    @Args("query", { type: () => String }) query: string,
    @Args("page", { type: () => Int, nullable: true, defaultValue: 1 })
    page: number,
    @Args("limit", { type: () => Int, nullable: true, defaultValue: 10 })
    limit: number
  ): Promise<DesignationsPaginatedResult> {
    try {
      return await this.designationService.search(query, page, limit);
    } catch (error) {
      throw new GraphQLException(
        "Failed to search designations",
        "INTERNAL_SERVER_ERROR"
      );
    }
  }
}
