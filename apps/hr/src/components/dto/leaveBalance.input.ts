import {
  InputType,
  Field,
  Int,
  PartialType,
  ObjectType,
} from "@nestjs/graphql";
import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsInt,
  IsDate,
} from "class-validator";
import { LeaveBalance } from "../entities/leaveBalance.entity";

// === Create Input ===
@InputType()
export class CreateLeaveBalanceInput {
  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  title?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsDate()
  leaveYear?: Date;

  @Field({ nullable: true })
  @IsOptional()
  @IsDate()
  fromDate?: Date;

  @Field({ nullable: true })
  @IsOptional()
  @IsDate()
  toDate?: Date;

  @Field(() => Int, { nullable: true })
  @IsOptional()
  @IsInt()
  createdBy?: number;
}

// === Update Input ===
@InputType()
export class UpdateLeaveBalanceInput extends PartialType(
  CreateLeaveBalanceInput
) {
  @Field(() => Int)
  @IsNotEmpty()
  @IsInt()
  id: number;
}

// === Pagination Object ===
@ObjectType()
export class LeaveBalancePaginatedResult {
  @Field(() => [LeaveBalance], { defaultValue: [] })
  leaveBalances: LeaveBalance[] = [];

  @Field(() => Int)
  totalPages: number;

  @Field(() => Int)
  currentPage: number;

  @Field(() => Int)
  totalCount: number;

  constructor(
    leaveBalances: LeaveBalance[],
    totalPages: number,
    currentPage: number,
    totalCount: number
  ) {
    this.leaveBalances = leaveBalances ?? [];
    this.totalPages = totalPages;
    this.currentPage = currentPage;
    this.totalCount = totalCount;
  }
}
