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
import { Attendance } from "../entities/attendance.entity";

@InputType()
export class CreateAttendanceInput {
  @Field()
  @IsNotEmpty()
  @IsString()
  employeeId: string;

  @Field()
  @IsNotEmpty()
  @IsDate()
  date: Date;

  @Field()
  @IsNotEmpty()
  @IsString()
  checkIn: string;

  @Field()
  @IsNotEmpty()
  @IsString()
  checkOut: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  shift?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  worked?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  status?: string;

  @Field(() => Int, { nullable: true })
  @IsOptional()
  @IsInt()
  createdBy?: number;
}

@InputType()
export class UpdateAttendanceInput extends PartialType(CreateAttendanceInput) {
  @Field(() => Int)
  @IsNotEmpty()
  @IsInt()
  id: number;
}

@ObjectType()
export class AttendancePaginatedResult {
  @Field(() => [Attendance], { defaultValue: [] }) // Always return an array
  attendances: Attendance[] = [];

  @Field(() => Int)
  totalPages: number;

  @Field(() => Int)
  currentPage: number;

  @Field(() => Int)
  totalCount: number;

  constructor(
    attendances: Attendance[],
    totalPages: number,
    currentPage: number,
    totalCount: number
  ) {
    this.attendances = attendances ?? [];
    this.totalPages = totalPages;
    this.currentPage = currentPage;
    this.totalCount = totalCount;
  }
}
