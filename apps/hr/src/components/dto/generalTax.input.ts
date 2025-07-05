import {
  InputType,
  Field,
  Int,
  PartialType,
  ObjectType,
} from "@nestjs/graphql";
import { IsOptional, IsString, IsInt } from "class-validator";
import { GeneralTax } from "../entities/general-tax.entity";

@InputType()
export class CreateGeneralTaxInput {
  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  companyLegalName?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  companyType?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  state1?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  city?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  streetAddress1?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  zipCode?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  state2?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  streetAddress2?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  state3?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  companyId?: string;

  @Field(() => Int, { nullable: true })
  @IsOptional()
  @IsInt()
  profileId?: number;

  @Field({ nullable: true })
  @IsOptional()
  @IsInt()
  ein?: number;
}

@InputType()
export class UpdateGeneralTaxInput extends PartialType(CreateGeneralTaxInput) {
  @Field(() => Int)
  @IsOptional()
  @IsInt()
  id?: number;
}

@ObjectType()
export class GeneralTaxPaginatedResult {
  @Field(() => [GeneralTax], { defaultValue: [] })
  generalTaxes: GeneralTax[] = [];

  @Field(() => Int)
  totalPages: number;

  @Field(() => Int)
  currentPage: number;

  @Field(() => Int)
  totalCount: number;

  constructor(
    generalTaxes: GeneralTax[],
    totalPages: number,
    currentPage: number,
    totalCount: number
  ) {
    this.generalTaxes = generalTaxes ?? [];
    this.totalPages = totalPages;
    this.currentPage = currentPage;
    this.totalCount = totalCount;
  }
}
