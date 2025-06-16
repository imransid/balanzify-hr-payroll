// import {
//   Int,
//   InputType,
//   Field,
//   ObjectType,
//   PartialType,
// } from "@nestjs/graphql";
// import {
//   IsNotEmpty,
//   IsString,
//   IsBoolean,
//   IsInt,
//   IsOptional,
// } from "class-validator";
// import { LeaveType } from "../entities/leaveType.entity";
// import { StatusType } from "../../prisma/OnboardingType.enum";

// @InputType()
// export class CreateLeaveTypeInput {
//   // Basic
//   @Field()
//   @IsNotEmpty()
//   @IsString()
//   leaveName: string;

//   @Field()
//   @IsNotEmpty()
//   @IsString()
//   displayName: string;

//   @Field()
//   @IsNotEmpty()
//   @IsString()
//   definition: string;

//   @Field()
//   @IsNotEmpty()
//   @IsString()
//   color: string;

//   @Field()
//   @IsNotEmpty()
//   @IsInt()
//   leaveTypeHourly: number;

//   @Field()
//   @IsNotEmpty()
//   @IsInt()
//   leaveTypeMaxHour: number;

//   // Leave Allocation
//   @Field()
//   @IsNotEmpty()
//   @IsInt()
//   maxLeaveAllocation: number;

//   @Field()
//   @IsNotEmpty()
//   @IsInt()
//   allowLeaveApplicationAfter: number;

//   @Field()
//   @IsNotEmpty()
//   @IsInt()
//   maxConsecutiveLeave: number;

//   // Carry Forward

//   @Field({ nullable: true })
//   @IsOptional()
//   @IsInt()
//   maxCarryForwardedLeaves?: number;

//   @Field({ nullable: true })
//   @IsOptional()
//   @IsInt()
//   expireCarryForwardedLeaves?: number;

//   // Encashment
//   @Field()
//   @IsNotEmpty()
//   @IsBoolean()
//   allowEncashment: boolean;

//   @Field({ nullable: true })
//   @IsOptional()
//   @IsInt()
//   maxEncashableLeaves?: number;

//   @Field({ nullable: true })
//   @IsOptional()
//   @IsInt()
//   minEncashableLeaves?: number;

//   @Field({ nullable: true })
//   @IsOptional()
//   @IsString()
//   earningComponents?: string;

//   // earned leaves
//   @Field()
//   @IsNotEmpty()
//   @IsBoolean()
//   isEarnedLeaves: boolean;

//   @Field()
//   @IsOptional()
//   @IsString()
//   earnLeaveFragrancy?: string;

//   @Field()
//   @IsOptional()
//   @IsString()
//   allocatedOnDays?: string;

//   @Field()
//   @IsOptional()
//   @IsString()
//   Rounders?: string;

//   // extra
//   @Field()
//   @IsOptional()
//   @IsNotEmpty()
//   @IsBoolean()
//   isLeaveWithoutPay: boolean;

//   @Field()
//   @IsOptional()
//   @IsNotEmpty()
//   @IsBoolean()
//   isOptionalLeaves: boolean;

//   @Field()
//   @IsOptional()
//   @IsNotEmpty()
//   @IsBoolean()
//   allowNegativeBalance: boolean;

//   @Field()
//   @IsOptional()
//   @IsNotEmpty()
//   @IsBoolean()
//   allowOverAllocation: boolean;

//   @Field()
//   @IsOptional()
//   @IsNotEmpty()
//   @IsBoolean()
//   includeHolidaysWithinLeavesONLeave: boolean;

//   @Field()
//   @IsOptional()
//   @IsNotEmpty()
//   @IsBoolean()
//   isCompensatory: boolean;

//   @Field(() => StatusType, {
//     defaultValue: StatusType.DE_ACTIVE,
//   }) // Change to use the enum
//   @IsNotEmpty()
//   status: keyof typeof StatusType;
// }

// @InputType()
// export class UpdateLeaveTypeInput extends PartialType(CreateLeaveTypeInput) {
//   @Field(() => Int)
//   @IsNotEmpty()
//   @IsInt()
//   id: number;

//   @Field({ nullable: true })
//   @IsOptional()
//   @IsString()
//   leaveName?: string;

//   @Field({ nullable: true })
//   @IsOptional()
//   @IsString()
//   displayName?: string;

//   @Field({ nullable: true })
//   @IsOptional()
//   @IsString()
//   definition?: string;

//   @Field({ nullable: true })
//   @IsOptional()
//   @IsString()
//   color?: string;

//   @Field()
//   @IsOptional()
//   @IsInt()
//   leaveTypeHourly: number;

//   @Field()
//   @IsOptional()
//   @IsInt()
//   leaveTypeMaxHour: number;
// }

// @ObjectType()
// export class LeaveTypePaginatedResult {
//   @Field(() => [LeaveType], { defaultValue: [] }) // Always return array
//   leaveTypes: LeaveType[] = [];

//   @Field(() => Int)
//   totalPages: number;

//   @Field(() => Int)
//   currentPage: number;

//   @Field(() => Int)
//   totalCount: number;

//   constructor(
//     leaveTypes: LeaveType[],
//     totalPages: number,
//     currentPage: number,
//     totalCount: number
//   ) {
//     this.leaveTypes = leaveTypes ?? [];
//     this.totalPages = totalPages;
//     this.currentPage = currentPage;
//     this.totalCount = totalCount;
//   }
// }

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
