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
  @Field(() => Int, { nullable: true })
  @IsOptional()
  @IsInt()
  leaveBalanceId?: number;

  @Field(() => Int, { nullable: true })
  @IsOptional()
  @IsInt()
  createdBy?: number;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsInt()
  data?: string;
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
  @Field(() => [LeaveBalanceDetails], { defaultValue: null })
  leaveBalanceDetails: LeaveBalanceDetails = null;

  @Field(() => Int)
  totalPages: number;

  @Field(() => Int)
  currentPage: number;

  @Field(() => Int)
  totalCount: number;

  constructor(
    leaveBalanceDetails: LeaveBalanceDetails,
    totalPages: number,
    currentPage: number,
    totalCount: number
  ) {
    this.leaveBalanceDetails = leaveBalanceDetails ?? null;
    this.totalPages = totalPages;
    this.currentPage = currentPage;
    this.totalCount = totalCount;
  }
}
