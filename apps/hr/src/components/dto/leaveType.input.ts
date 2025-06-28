import {
  Int,
  InputType,
  Field,
  ObjectType,
  PartialType,
} from "@nestjs/graphql";
import {
  IsNotEmpty,
  IsString,
  IsBoolean,
  IsInt,
  IsOptional,
} from "class-validator";
import { LeaveType } from "../entities/leaveType.entity";
import { StatusType } from "../../prisma/OnboardingType.enum";

@InputType()
export class CreateLeaveTypeInput {
  // Basic
  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  leaveName?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  selectLeave?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  displayName?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  definition?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  color?: string;

  @Field()
  @IsString()
  companyId: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsInt()
  leaveTypeHourly?: number;

  @Field({ nullable: true })
  @IsOptional()
  @IsInt()
  leaveTypeMaxHour?: number;

  // Leave Allocation
  @Field({ nullable: true })
  @IsOptional()
  @IsInt()
  maxLeaveAllocation?: number;

  @Field({ nullable: true })
  @IsOptional()
  @IsInt()
  allowLeaveApplicationAfter?: number;

  @Field({ nullable: true })
  @IsOptional()
  @IsInt()
  maxConsecutiveLeave?: number;

  // Carry Forward
  @Field({ nullable: true })
  @IsOptional()
  @IsInt()
  maxCarryForwardedLeaves?: number;

  @Field({ nullable: true })
  @IsOptional()
  @IsInt()
  expireCarryForwardedLeaves?: number;

  // Encashment
  @Field({ nullable: true })
  @IsOptional()
  @IsBoolean()
  allowEncashment?: boolean;

  @Field({ nullable: true })
  @IsOptional()
  @IsInt()
  maxEncashableLeaves?: number;

  @Field({ nullable: true })
  @IsOptional()
  @IsInt()
  minEncashableLeaves?: number;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  earningComponents?: string;

  // Earned leaves
  @Field({ nullable: true })
  @IsOptional()
  @IsBoolean()
  isEarnedLeaves?: boolean;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  earnLeaveFragrancy?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  allocatedOnDays?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  Rounders?: string;

  // Extra
  @Field({ nullable: true })
  @IsOptional()
  @IsBoolean()
  isLeaveWithoutPay?: boolean;

  @Field({ nullable: true })
  @IsOptional()
  @IsBoolean()
  isOptionalLeaves?: boolean;

  @Field({ nullable: true })
  @IsOptional()
  @IsBoolean()
  allowNegativeBalance?: boolean;

  @Field({ nullable: true })
  @IsOptional()
  @IsBoolean()
  allowOverAllocation?: boolean;

  @Field({ nullable: true })
  @IsOptional()
  @IsBoolean()
  includeHolidaysWithinLeavesONLeave?: boolean;

  @Field({ nullable: true })
  @IsOptional()
  @IsBoolean()
  isCompensatory?: boolean;

  @Field(() => StatusType, {
    nullable: true,
    defaultValue: StatusType.DE_ACTIVE,
  })
  @IsOptional()
  status?: keyof typeof StatusType;
}

@InputType()
export class UpdateLeaveTypeInput extends PartialType(CreateLeaveTypeInput) {
  @Field(() => Int)
  @IsNotEmpty()
  @IsInt()
  id: number;
}

@ObjectType()
export class LeaveTypePaginatedResult {
  @Field(() => [LeaveType], { defaultValue: [] })
  leaveTypes: LeaveType[] = [];

  @Field(() => Int)
  totalPages: number;

  @Field(() => Int)
  currentPage: number;

  @Field(() => Int)
  totalCount: number;

  constructor(
    leaveTypes: LeaveType[],
    totalPages: number,
    currentPage: number,
    totalCount: number
  ) {
    this.leaveTypes = leaveTypes ?? [];
    this.totalPages = totalPages;
    this.currentPage = currentPage;
    this.totalCount = totalCount;
  }
}
