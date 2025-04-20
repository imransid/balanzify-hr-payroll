import {
  InputType,
  Field,
  Int,
  PartialType,
  ObjectType,
} from "@nestjs/graphql";
import { IsNotEmpty, IsOptional, IsString, IsInt } from "class-validator";
import { Documentation } from "../entities/documentation.entity";
import { Upload } from "scalars/upload.scalar";

@InputType()
export class CreateDocumentationInput {
  @Field()
  @IsNotEmpty()
  @IsString()
  documentationName: string;

  @Field()
  @IsNotEmpty()
  @IsString()
  documentationSize: string;

  @Field()
  @IsNotEmpty()
  @IsString()
  lastUpdate: string;

  @Field()
  @IsNotEmpty()
  @IsString()
  uploadedBy: string;

  @Field(() => [Upload], {
    nullable: true,
    description: "Input for File.",
  })
  documentationFile: Upload[];

  @Field(() => Int, { nullable: true })
  @IsOptional()
  @IsInt()
  createdBy?: number;
}

@InputType()
export class UpdateDocumentationInput extends PartialType(
  CreateDocumentationInput
) {
  @Field(() => Int)
  @IsNotEmpty()
  @IsInt()
  id: number;
}

@ObjectType()
export class DocumentationPaginatedResult {
  @Field(() => [Documentation], { defaultValue: [] }) // Always return an array
  documentations: Documentation[] = [];

  @Field(() => Int)
  totalPages: number;

  @Field(() => Int)
  currentPage: number;

  @Field(() => Int)
  totalCount: number;

  constructor(
    documentations: Documentation[],
    totalPages: number,
    currentPage: number,
    totalCount: number
  ) {
    this.documentations = documentations ?? [];
    this.totalPages = totalPages;
    this.currentPage = currentPage;
    this.totalCount = totalCount;
  }
}
