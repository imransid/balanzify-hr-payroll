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
  IsBoolean,
  IsOptional,
  IsInt,
} from "class-validator";
import { PaySchedule } from "../entities/paySchedule.entity";

@InputType()
export class CreatePayScheduleInput {
  @Field()
  @IsNotEmpty()
  @IsString()
  title: string;

  @Field()
  @IsNotEmpty()
  @IsString()
  payFrequency: string;

  @Field()
  @IsNotEmpty()
  @IsString()
  nextPayDay: string;

  @Field()
  @IsNotEmpty()
  @IsString()
  endOfNextPayPeriod: string;

  @Field()
  @IsNotEmpty()
  @IsBoolean()
  isDefault: boolean;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  firstPayDayOfTheMonth?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  endOfFirstPayPeriod?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  dayBeforePayDayFirstPayOFMonth?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  month?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  secondPayDayOfTheMonth?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  endOfSecondPayPeriod?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  months?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  dayBeforePayDayFirstPayOFSecond?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  firstPayDayOfTheMonthTwice?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  endOfFirstPayPeriodTwice?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  dayBeforePayDayTwice?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsInt()
  createdBy?: number;
}

@InputType()
export class UpdatePayScheduleInput extends PartialType(
  CreatePayScheduleInput
) {
  @Field(() => Int)
  @IsNotEmpty()
  @IsInt()
  id: number;
}

@ObjectType()
export class PaySchedulePaginatedResult {
  @Field(() => [PaySchedule], { defaultValue: [] })
  paySchedules: PaySchedule[] = [];

  @Field(() => Int)
  totalPages: number;

  @Field(() => Int)
  currentPage: number;

  @Field(() => Int)
  totalCount: number;

  constructor(
    paySchedules: PaySchedule[],
    totalPages: number,
    currentPage: number,
    totalCount: number
  ) {
    this.paySchedules = paySchedules ?? [];
    this.totalPages = totalPages;
    this.currentPage = currentPage;
    this.totalCount = totalCount;
  }
}
