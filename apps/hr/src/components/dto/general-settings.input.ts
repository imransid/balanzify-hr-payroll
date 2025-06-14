import {
  InputType,
  Field,
  Int,
  PartialType,
  ObjectType,
} from "@nestjs/graphql";
import {
  IsOptional,
  IsString,
  IsBoolean,
  IsInt,
  IsDate,
  IsNotEmpty,
} from "class-validator";
import { GeneralSettings } from "../entities/generalSettings.entity";

@InputType()
export class CreateGeneralSettingsInput {
  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  calculatePayrollWorkingDaysBasedOn?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsBoolean()
  includeHolidaysInTotalNoOfWorkingDays?: boolean;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  maxWorkingHoursAgainstTimeSheet?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  fractionOfDailySalaryForHalfDay?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsBoolean()
  disableRoundTotal?: boolean;

  @Field({ nullable: true })
  @IsOptional()
  @IsBoolean()
  showLeaveBalancesInSalarySlip?: boolean;

  @Field({ nullable: true })
  @IsOptional()
  @IsBoolean()
  encryptSalarySlipsInEmails?: boolean;

  @Field({ nullable: true })
  @IsOptional()
  @IsBoolean()
  emailSalarySlipToEmployee?: boolean;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  emailTemplate?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  companyID?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  employeeID?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsBoolean()
  processPayrollAccountingEntryBasedOnEmployee?: boolean;

  @Field(() => Int, { nullable: true })
  @IsOptional()
  @IsInt()
  createdBy?: number;
}

@InputType()
export class UpdateGeneralSettingsInput extends PartialType(
  CreateGeneralSettingsInput
) {
  @Field(() => Int)
  @IsNotEmpty()
  @IsInt()
  id: number;
}

@ObjectType()
export class GeneralSettingsPaginatedResult {
  @Field(() => [GeneralSettings], { defaultValue: [] }) // Always return an array
  generalSettings: GeneralSettings[] = [];

  @Field(() => Int)
  totalPages: number;

  @Field(() => Int)
  currentPage: number;

  @Field(() => Int)
  totalCount: number;

  constructor(
    generalSettings: GeneralSettings[],
    totalPages: number,
    currentPage: number,
    totalCount: number
  ) {
    this.generalSettings = generalSettings ?? [];
    this.totalPages = totalPages;
    this.currentPage = currentPage;
    this.totalCount = totalCount;
  }
}
