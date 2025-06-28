import { Resolver, Query, Mutation, Args, Int } from "@nestjs/graphql";
import { DocumentationService } from "./documentation.service";
import {
  CreateDocumentationInput,
  UpdateDocumentationInput,
} from "../dto/documentation.input";
import { DocumentationPaginatedResult } from "../dto/documentation.input"; // Adjust path if different
import { Documentation } from "../entities/documentation.entity";
import { NotFoundException } from "@nestjs/common";
import { GraphQLException } from "exceptions/graphql-exception";

@Resolver(() => Documentation)
export class DocumentationResolver {
  constructor(private readonly documentationService: DocumentationService) {}

  @Mutation(() => Documentation)
  async createDocumentation(
    @Args("createDocumentationInput")
    createDocumentationInput: CreateDocumentationInput
  ): Promise<Documentation> {
    try {
      return await this.documentationService.create(createDocumentationInput);
    } catch (error) {
      throw new GraphQLException(
        "Failed to create documentation",
        "INTERNAL_SERVER_ERROR"
      );
    }
  }

  @Query(() => DocumentationPaginatedResult)
  async documentations(
    @Args("page", { type: () => Int, nullable: true, defaultValue: 1 })
    page: number,
    @Args("limit", { type: () => Int, nullable: true, defaultValue: 10 })
    limit: number,
    @Args("companyId", { type: () => String }) companyId: string
  ): Promise<DocumentationPaginatedResult> {
    try {
      return await this.documentationService.findAll(page, limit, companyId);
    } catch (error) {
      throw new GraphQLException(
        "Failed to fetch documentations",
        "INTERNAL_SERVER_ERROR"
      );
    }
  }

  @Query(() => Documentation)
  async documentation(
    @Args("id", { type: () => Int }) id: number
  ): Promise<Documentation> {
    try {
      return await this.documentationService.findOne(id);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new GraphQLException(
          `Documentation with ID ${id} not found`,
          "NOT_FOUND"
        );
      }
      throw new GraphQLException(
        "Failed to fetch documentation",
        "INTERNAL_SERVER_ERROR"
      );
    }
  }

  @Mutation(() => Documentation)
  async updateDocumentation(
    @Args("id", { type: () => Int }) id: number,
    @Args("updateDocumentationInput")
    updateDocumentationInput: UpdateDocumentationInput
  ): Promise<Documentation> {
    try {
      return await this.documentationService.update(
        id,
        updateDocumentationInput
      );
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new GraphQLException(
          `Documentation with ID ${id} not found`,
          "NOT_FOUND"
        );
      }
      throw new GraphQLException(
        "Failed to update documentation",
        "INTERNAL_SERVER_ERROR"
      );
    }
  }

  @Mutation(() => Documentation)
  async removeDocumentation(
    @Args("id", { type: () => Int }) id: number
  ): Promise<Documentation> {
    try {
      return await this.documentationService.remove(id);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new GraphQLException(
          `Documentation with ID ${id} not found`,
          "NOT_FOUND"
        );
      }
      throw new GraphQLException(
        "Failed to remove documentation",
        "INTERNAL_SERVER_ERROR"
      );
    }
  }

  @Query(() => DocumentationPaginatedResult)
  async searchDocumentations(
    @Args("query", { type: () => String }) query: string,
    @Args("page", { type: () => Int, nullable: true, defaultValue: 1 })
    page: number,
    @Args("limit", { type: () => Int, nullable: true, defaultValue: 10 })
    limit: number,
    @Args("companyId", { type: () => String }) companyId: string
  ): Promise<DocumentationPaginatedResult> {
    try {
      return await this.documentationService.search(
        query,
        companyId,
        page,
        limit
      );
    } catch (error) {
      throw new GraphQLException(
        "Failed to search documentations",
        "INTERNAL_SERVER_ERROR"
      );
    }
  }
}
