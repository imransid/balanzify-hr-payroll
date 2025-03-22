import {
  Int,
  PartialType,
  InputType,
  Field,
  ObjectType,
} from "@nestjs/graphql";
import {
  IsNotEmpty,
  IsString,
  IsBoolean,
  IsInt,
  IsOptional,
} from "class-validator";
import { Designation } from "../entities/designation.entity";

@InputType()
export class CreateDesignationInput {
  @Field()
  @IsNotEmpty()
  @IsString()
  designationName: string;

  @Field()
  @IsNotEmpty()
  @IsString()
  designation: string;
}

@InputType()
export class UpdateDesignationInput extends PartialType(
  CreateDesignationInput
) {
  @Field(() => Int)
  @IsNotEmpty()
  @IsInt()
  id: number;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  designationName?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsBoolean()
  designation?: string;
}

@ObjectType()
export class DesignationsPaginatedResult {
  @Field(() => [Designation], { defaultValue: [] }) // Ensuring it's always an array
  designations: Designation[] = [];

  @Field(() => Int)
  totalPages: number;

  @Field(() => Int)
  currentPage: number;

  @Field(() => Int)
  totalCount: number;

  constructor(
    designations: Designation[],
    totalPages: number,
    currentPage: number,
    totalCount: number
  ) {
    this.designations = designations ?? [];
    this.totalPages = totalPages;
    this.currentPage = currentPage;
    this.totalCount = totalCount;
  }
}
