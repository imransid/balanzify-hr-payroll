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
  IsDate,
  IsOptional,
  IsInt,
} from "class-validator";
import { TimeSheet } from "../entities/timesheet.entity";

@InputType()
export class CreateTimeSheetInput {
  @Field(() => Int)
  @IsInt()
  employeeId: number;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  remarks?: string;

  @Field()
  @IsString()
  companyId: string;

  @Field({ nullable: true })
  @IsOptional()
  startTime?: Date;

  @Field({ nullable: true })
  @IsOptional()
  endTime?: Date;

  @Field({ nullable: true })
  @IsOptional()
  startProcessDate?: Date;

  @Field({ nullable: true })
  @IsOptional()
  endProcessDate?: Date;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  totalTime?: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  status?: string;

  @Field(() => Int, { nullable: true })
  @IsOptional()
  @IsInt()
  createdBy?: number;
}

@InputType()
export class UpdateTimeSheetInput extends PartialType(CreateTimeSheetInput) {
  @Field(() => Int)
  @IsNotEmpty()
  @IsInt()
  id: number;
}

@ObjectType()
export class TimeSheetsPaginatedResult {
  @Field(() => [TimeSheet], { defaultValue: [] })
  timeSheets: TimeSheet[] = [];

  @Field(() => Int)
  totalPages: number;

  @Field(() => Int)
  currentPage: number;

  @Field(() => Int)
  totalCount: number;

  constructor(
    timeSheets: TimeSheet[],
    totalPages: number,
    currentPage: number,
    totalCount: number
  ) {
    this.timeSheets = timeSheets ?? [];
    this.totalPages = totalPages;
    this.currentPage = currentPage;
    this.totalCount = totalCount;
  }
}
