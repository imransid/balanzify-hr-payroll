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
  IsArray,
  IsInt,
  IsNotEmpty,
  IsNumber,
} from "class-validator";
import { ProfileDetails } from "../entities/profileDetails.entity";

@InputType()
export class CreateProfileDetailsInput {
  @Field({ nullable: true }) @IsOptional() @IsString() series?: string;
  @Field({ nullable: true }) @IsOptional() @IsString() salutation?: string;
  @Field({ nullable: true }) @IsOptional() @IsString() firstName?: string;
  @Field({ nullable: true }) @IsOptional() @IsString() middleName?: string;
  @Field({ nullable: true }) @IsOptional() @IsString() lastName?: string;
  @Field({ nullable: true }) @IsOptional() @IsString() gender?: string;
  @Field({ nullable: true }) @IsOptional() @IsString() dateOfBirth?: string;
  @Field({ nullable: true }) @IsOptional() @IsString() ssn?: string;
  @Field({ nullable: true }) @IsOptional() @IsString() dateOfJoining?: string;
  @Field({ nullable: true }) @IsOptional() @IsString() status?: string;

  @Field({ nullable: true }) @IsOptional() @IsString() company?: string;
  @Field({ nullable: true }) @IsOptional() @IsString() reportsTo?: string;
  @Field({ nullable: true }) @IsOptional() @IsString() department?: string;
  @Field({ nullable: true }) @IsOptional() @IsString() designation?: string;
  @Field({ nullable: true }) @IsOptional() @IsString() role?: string;
  @Field({ nullable: true }) @IsOptional() @IsString() workEmail?: string;
  @Field({ nullable: true }) @IsOptional() @IsString() WorkPhone?: string;
  @Field({ nullable: true }) @IsOptional() @IsString() employeeType?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsBoolean()
  useCompanyAddress?: boolean;
  @Field({ nullable: true }) @IsOptional() @IsString() workAddress?: string;
  @Field({ nullable: true }) @IsOptional() @IsString() workState?: string;
  @Field({ nullable: true }) @IsOptional() @IsString() workZip?: string;
  @Field({ nullable: true }) @IsOptional() @IsString() workCity?: string;
  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  conformationDate?: string;
  @Field({ nullable: true }) @IsOptional() @IsString() noticeDate?: string;
  @Field({ nullable: true }) @IsOptional() @IsString() offerDate?: string;
  @Field({ nullable: true }) @IsOptional() @IsString() contractEndDate?: string;

  @Field({ nullable: true }) @IsOptional() @IsString() terminateDate?: string;
  @Field({ nullable: true }) @IsOptional() @IsString() lastDaysWorked?: string;
  @Field({ nullable: true }) @IsOptional() @IsString() terminateType?: string;
  @Field({ nullable: true }) @IsOptional() @IsString() terminateDesc?: string;

  @Field({ nullable: true }) @IsOptional() @IsString() phoneNumber?: string;
  @Field({ nullable: true }) @IsOptional() @IsString() homePhone?: string;
  @Field({ nullable: true }) @IsOptional() @IsString() personalEmail?: string;
  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  preferredContactEmail?: string;

  @Field({ nullable: true }) @IsOptional() @IsString() homeAddress?: string;
  @Field({ nullable: true }) @IsOptional() @IsString() homeCity?: string;
  @Field({ nullable: true }) @IsOptional() @IsString() homeState?: string;
  @Field({ nullable: true }) @IsOptional() @IsString() homeZipCode?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsBoolean()
  mailingAddressIsTheSame?: boolean;
  @Field({ nullable: true }) @IsOptional() @IsString() mailingAddress?: string;
  @Field({ nullable: true }) @IsOptional() @IsString() mailingState?: string;
  @Field({ nullable: true }) @IsOptional() @IsString() mailingCity?: string;
  @Field({ nullable: true }) @IsOptional() @IsString() mailingZipCode?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  uscis_alien_regis_number?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  formi9?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  foreignPassportNumber?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  citizenship?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  signName?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  otherCountryName?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  includeSSN?: boolean;

  @Field({ nullable: true }) @IsOptional() @IsString() photo?: string;
  @Field({ nullable: true }) @IsOptional() @IsString() displayName?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  emergencyContactName?: string;
  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  emergencyRelation?: string;
  @Field({ nullable: true }) @IsOptional() @IsString() emergencyPhone?: string;

  @Field({ nullable: true }) @IsOptional() @IsString() paymentMethod?: string;
  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  accountingNumber?: string;
  @Field({ nullable: true }) @IsOptional() @IsString() accountType?: string;
  @Field({ nullable: true }) @IsOptional() @IsString() accountBankName?: string;
  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  accountConfirmAccountingNumber?: string;
  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  accountConfirmRoutingNumber?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  attendanceDeviceIDBiometricRFtagID?: string;
  @Field({ nullable: true }) @IsOptional() @IsInt() holidayID?: number;
  @Field({ nullable: true }) @IsOptional() @IsInt() shiftId?: number;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  stateWhereTheEmployeeLives?: string;
  @Field({ nullable: true }) @IsOptional() @IsString() maritalStatus?: string;
  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  totalNumberOfAllowances_box_f?: string;
  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  additionalWithHolding?: string;
  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  exemptFromWithHolding_section_2NotExample?: string;
  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  IsThisEmployeeExemptFromMyState?: string;
  @Field({ nullable: true })
  @IsOptional()
  enterAmount?: number;
  @Field({ nullable: true })
  @IsOptional()
  @IsBoolean()
  doesTheEmployeesWorkInTheStateWhereTheLives?: boolean;
  @Field({ nullable: true })
  @IsOptional()
  @IsBoolean()
  isThisEmployeeExemptFromMyState?: boolean;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  which_W_4_DoesEmployeeHave?: string;
  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  WithHoldingStatus?: string;
  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  multipleJobsOrSpouseWorks?: string;
  @Field({ nullable: true }) @IsOptional() @IsString() claimDepends?: string;
  @Field({ nullable: true }) @IsOptional() @IsString() deductions?: string;
  @Field({ nullable: true }) @IsOptional() @IsString() otherIncome?: string;
  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  extraWithHolding?: string;
  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  exemptFromWithHolding?: string;
  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  isThisEmployeeExemptFromFederalTax?: string;
  @Field({ nullable: true })
  @IsOptional()
  @IsBoolean()
  employeeAccessToForm_W_4?: boolean;

  @Field({ nullable: true }) @IsOptional() @IsNumber() payScheduleID?: number;
  @Field({ nullable: true }) @IsOptional() @IsBoolean() overTime?: boolean;
  @Field({ nullable: true }) @IsOptional() @IsString() payType?: string;
  @Field({ nullable: true }) @IsOptional() @IsString() payFrequency?: string;
  @Field({ nullable: true }) @IsOptional() @IsString() salary?: string;
  @Field({ nullable: true }) @IsOptional() @IsString() hoursPerDay?: string;
  @Field({ nullable: true }) @IsOptional() @IsString() dayForWeek?: string;

  @Field({ nullable: true }) @IsOptional() @IsString() ratePerHour?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsBoolean()
  doubleOverTimePay?: boolean;
  @Field({ nullable: true }) @IsOptional() @IsBoolean() holidayPay?: boolean;
  @Field({ nullable: true }) @IsOptional() @IsBoolean() bonus?: boolean;

  @Field(() => [String], { nullable: true })
  @IsOptional()
  @IsArray()
  earning?: string[];
  @Field(() => [String], { nullable: true })
  @IsOptional()
  @IsArray()
  deduction_Contribution?: string[];
  @Field(() => [String], { nullable: true })
  @IsOptional()
  @IsArray()
  garnishment?: string[];
  @Field(() => [String], { nullable: true })
  @IsOptional()
  @IsArray()
  educationalQualification?: string[];
  @Field(() => [String], { nullable: true })
  @IsOptional()
  @IsArray()
  previousWorkExperience?: string[];
  @Field(() => [String], { nullable: true })
  @IsOptional()
  @IsArray()
  historyInCompany?: string[];

  @Field(() => Int) @IsNotEmpty() @IsInt() profileId: number;

  @Field(() => [String], { nullable: true })
  @IsOptional()
  @IsArray()
  documentationsID?: string[];

  @Field(() => Int, { nullable: true })
  @IsOptional()
  @IsInt()
  createdBy?: number;
}

@InputType()
export class UpdateProfileDetailsInput extends PartialType(
  CreateProfileDetailsInput
) {
  @Field(() => Int)
  @IsNotEmpty()
  @IsInt()
  id: number;
}

@ObjectType()
export class ProfileDetailsPaginatedResult {
  @Field(() => [ProfileDetails], { defaultValue: [] })
  profileDetails: ProfileDetails[] = [];

  @Field(() => Int)
  totalPages: number;

  @Field(() => Int)
  currentPage: number;

  @Field(() => Int)
  totalCount: number;

  constructor(
    profileDetails: ProfileDetails[],
    totalPages: number,
    currentPage: number,
    totalCount: number
  ) {
    this.profileDetails = profileDetails ?? [];
    this.totalPages = totalPages;
    this.currentPage = currentPage;
    this.totalCount = totalCount;
  }
}
