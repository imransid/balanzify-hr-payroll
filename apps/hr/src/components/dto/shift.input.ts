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
import { Shift } from "../entities/shift.entity";

// Create Shift Input Type
@InputType()
export class CreateShiftInput {
  @Field()
  @IsNotEmpty()
  @IsString()
  shiftName: string;

  @Field()
  @IsNotEmpty()
  @IsString()
  shiftCode: string;

  @Field()
  @IsNotEmpty()
  @IsString()
  shiftDescription: string;

  @Field()
  @IsNotEmpty()
  @IsString()
  shiftType: string;

  @Field()
  @IsNotEmpty()
  @IsString()
  regularHour: string;

  @Field()
  @IsNotEmpty()
  @IsString()
  shiftLate: string;

  @Field()
  @IsNotEmpty()
  @IsString()
  shiftIn: string;

  @Field()
  @IsNotEmpty()
  @IsString()
  shiftOut: string;

  @Field()
  @IsNotEmpty()
  @IsString()
  lunchTime: string;

  @Field()
  @IsNotEmpty()
  @IsString()
  lunchIn: string;

  @Field()
  @IsNotEmpty()
  @IsString()
  lunchOut: string;

  @Field()
  @IsNotEmpty()
  @IsString()
  tiffinTime: string;

  @Field()
  @IsNotEmpty()
  @IsString()
  tiffinIn: string;

  @Field()
  @IsNotEmpty()
  @IsString()
  tiffinOut: string;

  @Field(() => Int, { nullable: true })
  @IsOptional()
  createdBy?: number;
}

// Update Shift Input Type
@InputType()
export class UpdateShiftInput extends PartialType(CreateShiftInput) {
  @Field(() => Int)
  @IsNotEmpty()
  @IsInt()
  id: number;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  shiftName?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  shiftCode?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  shiftDescription?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  shiftType?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  regularHour?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  shiftLate?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  shiftIn?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  shiftOut?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  lunchTime?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  lunchIn?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  lunchOut?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  tiffinTime?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  tiffinIn?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  tiffinOut?: string;

  @Field(() => Int, { nullable: true })
  @IsOptional()
  createdBy?: number;
}

// Paginated Result for Shift
@ObjectType()
export class ShiftPaginatedResult {
  @Field(() => [Shift], { defaultValue: [] })
  shifts: Shift[] = [];

  @Field(() => Int)
  totalPages: number;

  @Field(() => Int)
  currentPage: number;

  @Field(() => Int)
  totalCount: number;

  constructor(
    shifts: Shift[],
    totalPages: number,
    currentPage: number,
    totalCount: number
  ) {
    this.shifts = shifts ?? [];
    this.totalPages = totalPages;
    this.currentPage = currentPage;
    this.totalCount = totalCount;
  }
}
