import {
  Int,
  PartialType,
  InputType,
  Field,
  ObjectType,
} from "@nestjs/graphql";
import { IsNotEmpty, IsString, IsInt, IsBoolean } from "class-validator";
import { DeductionContribution } from "../entities/deductionContribution.entity";

@InputType()
export class CreateDeductionContributionInput {
  @Field()
  @IsNotEmpty()
  @IsString()
  title: string;

  @Field()
  @IsNotEmpty()
  @IsString()
  deductionContributionType: string;

  @Field()
  @IsNotEmpty()
  @IsString()
  type: string;

  @Field()
  @IsNotEmpty()
  @IsString()
  taxOptions: string;

  @Field()
  @IsNotEmpty()
  @IsBoolean()
  status: boolean;

  @Field()
  @IsNotEmpty()
  @IsString()
  companyId: string;
}

@InputType()
export class UpdateDeductionContributionInput extends PartialType(
  CreateDeductionContributionInput
) {
  @Field(() => Int)
  @IsNotEmpty()
  @IsInt()
  id: number;

  @Field({ nullable: true })
  @IsNotEmpty()
  @IsString()
  title: string;

  @Field({ nullable: true })
  @IsNotEmpty()
  @IsString()
  deductionContributionType: string;

  @Field({ nullable: true })
  @IsNotEmpty()
  @IsString()
  type: string;

  @Field({ nullable: true })
  @IsNotEmpty()
  @IsString()
  taxOptions: string;

  @Field({ nullable: true })
  @IsNotEmpty()
  @IsBoolean()
  status: boolean;
}

@ObjectType()
export class DeductionContributionPaginatedResult {
  @Field(() => [DeductionContribution], { defaultValue: [] }) // Ensuring it's always an array
  deductionContributions: DeductionContribution[] = [];

  @Field(() => Int)
  totalPages: number;

  @Field(() => Int)
  currentPage: number;

  @Field(() => Int)
  totalCount: number;

  constructor(
    deductionContributions: DeductionContribution[],
    totalPages: number,
    currentPage: number,
    totalCount: number
  ) {
    this.deductionContributions = deductionContributions ?? [];
    this.totalPages = totalPages;
    this.currentPage = currentPage;
    this.totalCount = totalCount;
  }
}
