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
  @IsNotEmpty()
  @IsInt()
  employeeId: number;

  @Field()
  @IsNotEmpty()
  @IsString()
  remarks: string;

  @Field()
  @IsNotEmpty()
  @IsDate()
  startTime: Date;

  @Field()
  @IsNotEmpty()
  @IsDate()
  endTime: Date;

  @Field()
  @IsNotEmpty()
  @IsDate()
  startProcessDate: Date;

  @Field()
  @IsNotEmpty()
  @IsDate()
  endProcessDate: Date;

  @Field()
  @IsNotEmpty()
  @IsString()
  totalTime: string;

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
