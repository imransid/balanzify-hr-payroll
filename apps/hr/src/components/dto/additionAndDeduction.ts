import {
  InputType,
  Field,
  Int,
  ObjectType,
  PartialType,
} from "@nestjs/graphql";
import {
  IsNotEmpty,
  IsString,
  IsOptional,
  IsDate,
  IsInt,
} from "class-validator";
import { PayrollAdditionAndDeduction } from "../entities/payroll-addition-and-deduction.entity";

@InputType()
export class CreatePayrollAdditionAndDeductionInput {
  @Field()
  @IsNotEmpty()
  @IsString()
  uid: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  kind?: string;

  @Field({ nullable: true })
  @IsString()
  amount?: string;

  @Field({ nullable: true })
  @IsDate()
  inputDate?: Date;

  @Field({ nullable: true })
  @IsDate()
  joinDate?: Date;

  @Field({ nullable: true })
  @IsString()
  designation?: string;

  @Field({ nullable: true })
  @IsString()
  department?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  remark?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  employee?: string;
}

@InputType()
export class UpdatePayrollAdditionAndDeductionInput extends PartialType(
  CreatePayrollAdditionAndDeductionInput
) {
  @Field(() => Int)
  @IsNotEmpty()
  @IsInt()
  id: number;
}

@ObjectType()
export class PayrollAdditionAndDeductionPaginatedResult {
  @Field(() => [PayrollAdditionAndDeduction], { defaultValue: [] })
  items: PayrollAdditionAndDeduction[] = [];

  @Field(() => Int)
  totalPages: number;

  @Field(() => Int)
  currentPage: number;

  @Field(() => Int)
  totalCount: number;

  constructor(
    items: PayrollAdditionAndDeduction[],
    totalPages: number,
    currentPage: number,
    totalCount: number
  ) {
    this.items = items ?? [];
    this.totalPages = totalPages;
    this.currentPage = currentPage;
    this.totalCount = totalCount;
  }
}
