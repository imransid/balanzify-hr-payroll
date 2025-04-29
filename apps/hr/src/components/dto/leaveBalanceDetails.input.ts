import {
  InputType,
  Field,
  Int,
  PartialType,
  ObjectType,
} from "@nestjs/graphql";
import {
  IsNotEmpty,
  IsString,
  IsOptional,
  IsInt,
  IsDate,
} from "class-validator";
import { LeaveBalanceDetails } from "../entities/leave-balance-details.entity";

@InputType()
export class CreateLeaveBalanceDetailsInput {
  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  EMPCode?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  EMPName?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  Sick?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  Casual?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  Earn?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  LWP?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  PL?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  CO?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  ShortL?: string;

  @Field(() => Int, { nullable: true })
  @IsOptional()
  @IsInt()
  leaveBalanceId?: number;

  @Field(() => Int, { nullable: true })
  @IsOptional()
  @IsInt()
  createdBy?: number;
}

@InputType()
export class UpdateLeaveBalanceDetailsInput extends PartialType(
  CreateLeaveBalanceDetailsInput
) {
  @Field(() => Int)
  @IsNotEmpty()
  @IsInt()
  id: number;
}

@ObjectType()
export class LeaveBalanceDetailsPaginatedResult {
  @Field(() => [LeaveBalanceDetails], { defaultValue: [] })
  leaveBalanceDetails: LeaveBalanceDetails[] = [];

  @Field(() => Int)
  totalPages: number;

  @Field(() => Int)
  currentPage: number;

  @Field(() => Int)
  totalCount: number;

  constructor(
    leaveBalanceDetails: LeaveBalanceDetails[],
    totalPages: number,
    currentPage: number,
    totalCount: number
  ) {
    this.leaveBalanceDetails = leaveBalanceDetails ?? [];
    this.totalPages = totalPages;
    this.currentPage = currentPage;
    this.totalCount = totalCount;
  }
}
