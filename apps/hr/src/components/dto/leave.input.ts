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
  IsDate,
  IsBoolean,
  IsInt,
  IsOptional,
} from "class-validator";
import { Leave } from "../entities/leave.entity";
import { Upload } from "scalars/upload.scalar";
@InputType()
export class CreateLeaveInput {
  @Field()
  @IsNotEmpty()
  @IsString()
  leaveName: string;

  @Field()
  @IsNotEmpty()
  @IsString()
  displayName: string;

  @Field()
  @IsNotEmpty()
  @IsString()
  definition: string;

  @Field()
  @IsNotEmpty()
  @IsString()
  color: string;

  @Field()
  @IsNotEmpty()
  @IsString()
  leaveType: string;

  @Field()
  @IsNotEmpty()
  @IsInt()
  maxLeaveAllocation: number;

  @Field()
  @IsNotEmpty()
  @IsBoolean()
  status: boolean;

  @Field(() => [Upload], {
    nullable: true,
    description: "Input for File.",
  })
  documentationFile: Upload[];
}

@InputType()
export class UpdateLeaveInput extends PartialType(CreateLeaveInput) {
  @Field(() => Int)
  @IsNotEmpty()
  @IsInt()
  id: number;
}

@ObjectType()
export class LeavePaginatedResult {
  @Field(() => [Leave], { defaultValue: [] }) // Ensuring it's always an array
  leaves: Leave[] = [];

  @Field(() => Int)
  totalPages: number;

  @Field(() => Int)
  currentPage: number;

  @Field(() => Int)
  totalCount: number;

  constructor(
    leaves: Leave[],
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
