import {
  InputType,
  Field,
  Int,
  PartialType,
  ObjectType,
} from "@nestjs/graphql";
import {
  IsString,
  IsOptional,
  IsDate,
  IsInt,
  IsNotEmpty,
} from "class-validator";
import { Upload } from "scalars/upload.scalar";
import { EmployeeLeave } from "../entities/leave.entity";

@InputType()
export class CreateEmployeeLeaveInput {
  @Field(() => Int, { nullable: true })
  @IsOptional()
  @IsInt()
  leaveBalanceId?: number;

  @Field(() => Int, { nullable: true })
  @IsOptional()
  @IsInt()
  leaveTypeId?: number;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  leaveType?: string;

  @Field()
  @IsNotEmpty()
  @IsString()
  companyId: string;

  @Field(() => Int, { nullable: true })
  @IsOptional()
  @IsInt()
  totalDays?: number;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  selectLeave?: string;

  @Field(() => Int, { nullable: true })
  @IsOptional()
  @IsInt()
  deskLookByEmployeeID?: number;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  deskLookByEmployeeName?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  note?: string;

  @Field(() => Date, { nullable: true })
  @IsOptional()
  @IsDate()
  fromDate?: Date;

  @Field(() => Date, { nullable: true })
  @IsOptional()
  @IsDate()
  toDate?: Date;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  status?: string;

  @Field(() => Int, { nullable: true })
  @IsOptional()
  @IsInt()
  profileId?: number;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsInt()
  docUrl?: string;

  // @Field(() => [Upload], {
  //   nullable: true,
  //   description: "Supporting documentation file (optional)",
  // })
  // documentationFile?: Upload[];
}

@InputType()
export class UpdateEmployeeLeaveInput extends PartialType(
  CreateEmployeeLeaveInput
) {
  @Field(() => Int)
  @IsInt()
  id: number;
}

@ObjectType()
export class LeavePaginatedResult {
  @Field(() => [EmployeeLeave], { defaultValue: [] }) // Ensuring it's always an array
  leaves: EmployeeLeave[] = [];

  @Field(() => Int)
  totalPages: number;

  @Field(() => Int)
  currentPage: number;

  @Field(() => Int)
  totalCount: number;

  constructor(
    leaves: EmployeeLeave[],
    totalPages: number,
    currentPage: number,
    totalCount: number
  ) {
    this.leaves = leaves ?? [];
    this.totalPages = totalPages;
    this.currentPage = currentPage;
    this.totalCount = totalCount;
  }
}
