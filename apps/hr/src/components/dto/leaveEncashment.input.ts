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
  IsInt,
  IsOptional,
  IsIn,
  ArrayNotEmpty,
  IsArray,
  IsDate,
} from "class-validator";
import { LeaveEncashment } from "../entities/leaveEncashment.entity";

// Create Leave Encashment Input Type
@InputType()
export class CreateLeaveEncashmentInput {
  @Field()
  @IsNotEmpty()
  @IsString()
  empId: string;

  @Field()
  @IsNotEmpty()
  @IsString()
  employeeName: string;

  @Field()
  @IsNotEmpty()
  @IsString()
  leavePeriod: string;

  @Field()
  @IsNotEmpty()
  @IsString()
  leaveYear: string;

  @Field()
  @IsNotEmpty()
  @IsString()
  currency: string;

  @Field()
  @IsNotEmpty()
  @IsString()
  designation: string;

  @Field()
  @IsNotEmpty()
  @IsString()
  department: string;

  @Field()
  @IsNotEmpty()
  @IsString()
  leaveBalancePeriod: string;

  @Field()
  @IsNotEmpty()
  @IsDate()
  encashmentDate: Date;

  @Field(() => [Int])
  @IsNotEmpty()
  @IsArray()
  @ArrayNotEmpty()
  @IsInt({ each: true })
  @IsIn([1, 2, 3, 4], { each: true }) // Each item must be 1, 2, 3, or 4
  leaveTypeID: number[];

  @Field(() => Int, { nullable: true })
  @IsOptional()
  createdBy?: number;
}

// Update Leave Encashment Input Type
@InputType()
export class UpdateLeaveEncashmentInput extends PartialType(
  CreateLeaveEncashmentInput
) {
  @Field(() => Int)
  @IsNotEmpty()
  @IsInt()
  id: number;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  empId?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  employeeName?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  leavePeriod?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  leaveYear?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  currency?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  designation?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  department?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  leaveBalancePeriod?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  leaveEncasementDetails: number[];

  @Field(() => Int, { nullable: true })
  @IsOptional()
  createdBy?: number;
}

@ObjectType()
export class LeaveEncashmentInputPaginatedResult {
  @Field(() => [LeaveEncashment], { defaultValue: [] }) // Ensuring it's always an array
  leaveEncashment: LeaveEncashment[] = [];

  @Field(() => Int)
  totalPages: number;

  @Field(() => Int)
  currentPage: number;

  @Field(() => Int)
  totalCount: number;

  constructor(
    leaveEncashment: LeaveEncashment[],
    totalPages: number,
    currentPage: number,
    totalCount: number
  ) {
    this.leaveEncashment = leaveEncashment ?? [];
    this.totalPages = totalPages;
    this.currentPage = currentPage;
    this.totalCount = totalCount;
  }
}
