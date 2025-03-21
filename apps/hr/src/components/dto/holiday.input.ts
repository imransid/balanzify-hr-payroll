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
import { Holiday } from "../entities/holiday.entity";

@InputType()
export class CreateHolidayInput {
  @Field()
  @IsNotEmpty()
  @IsString()
  name: string;

  @Field()
  @IsNotEmpty()
  @IsString()
  color: string;

  @Field()
  @IsNotEmpty()
  @IsDate()
  fromDate: Date;

  @Field()
  @IsNotEmpty()
  @IsDate()
  toDate: Date;

  @Field()
  @IsNotEmpty()
  @IsString()
  country: string;

  @Field()
  @IsNotEmpty()
  @IsString()
  weekend: string;

  @Field()
  @IsNotEmpty()
  @IsString()
  totalHoliday: string;

  @Field()
  @IsNotEmpty()
  @IsBoolean()
  status: boolean;
}

@InputType()
export class UpdateHolidayInput extends PartialType(CreateHolidayInput) {
  @Field(() => Int)
  @IsNotEmpty()
  @IsInt()
  id: number;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  color?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  name?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsDate()
  fromDate?: Date;

  @Field({ nullable: true })
  @IsOptional()
  @IsDate()
  toDate?: Date;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  country?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  weekend?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  totalHoliday?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsBoolean()
  status?: boolean;
}

@ObjectType()
export class HolidayPaginatedResult {
  @Field(() => [Holiday], { defaultValue: [] }) // Ensuring it's always an array
  holidays: Holiday[] = [];

  @Field(() => Int)
  totalPages: number;

  @Field(() => Int)
  currentPage: number;

  @Field(() => Int)
  totalCount: number;

  constructor(
    holidays: Holiday[],
    totalPages: number,
    currentPage: number,
    totalCount: number
  ) {
    this.holidays = holidays ?? [];
    this.totalPages = totalPages;
    this.currentPage = currentPage;
    this.totalCount = totalCount;
  }
}
