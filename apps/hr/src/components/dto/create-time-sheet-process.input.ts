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
import { TimeSheetProcess } from "../entities/timeSheetProcess.entity";

@InputType()
export class CreateTimeSheetProcessInput {
  @Field()
  @IsNotEmpty()
  @IsDate()
  startProcessTime: Date;

  @Field()
  @IsNotEmpty()
  @IsDate()
  endProcessTIme: Date;

  @Field()
  @IsNotEmpty()
  @IsString()
  dateType: string;

  @Field(() => Int)
  @IsNotEmpty()
  @IsInt()
  profileId: number;

  @Field(() => Int, { nullable: true })
  @IsOptional()
  @IsInt()
  createdBy?: number;
}

@InputType()
export class UpdateTimeSheetProcessInput extends PartialType(
  CreateTimeSheetProcessInput
) {
  @Field(() => Int)
  @IsNotEmpty()
  @IsInt()
  id: number;

  @Field()
  @IsNotEmpty()
  @IsString()
  status: string;
}

@ObjectType()
export class TimeSheetProcessPaginatedResult {
  @Field(() => [TimeSheetProcess], { defaultValue: [] }) // Always return an array
  timeSheetProcesses: TimeSheetProcess[] = [];

  @Field(() => Int)
  totalPages: number;

  @Field(() => Int)
  currentPage: number;

  @Field(() => Int)
  totalCount: number;

  constructor(
    timeSheetProcesses: TimeSheetProcess[],
    totalPages: number,
    currentPage: number,
    totalCount: number
  ) {
    this.timeSheetProcesses = timeSheetProcesses ?? [];
    this.totalPages = totalPages;
    this.currentPage = currentPage;
    this.totalCount = totalCount;
  }
}
