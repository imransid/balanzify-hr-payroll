import { ObjectType, Field, Int } from "@nestjs/graphql";
import { Documentation } from "./documentation.entity";
import { Shift } from "./shift.entity";
import { PaySchedule } from "./paySchedule.entity";

@ObjectType()
export class ProfileDetails {
  @Field(() => Int)
  id: number;

  // Personal Info
  @Field({ nullable: true }) series?: string;
  @Field({ nullable: true }) salutation?: string;
  @Field({ nullable: true }) firstName?: string;
  @Field({ nullable: true }) middleName?: string;
  @Field({ nullable: true }) lastName?: string;
  @Field({ nullable: true }) gender?: string;
  @Field({ nullable: true }) dateOfBirth?: string;
  @Field({ nullable: true }) ssn?: string;
  @Field({ nullable: true }) dateOfJoining?: string;
  @Field({ nullable: true }) status?: string;

  // Work Info
  @Field({ nullable: true }) company?: string;
  @Field({ nullable: true }) reportsTo?: string;
  @Field({ nullable: true }) department?: string;
  @Field({ nullable: true }) designation?: string;
  @Field({ nullable: true }) role?: string;
  @Field({ nullable: true }) workEmail?: string;
  @Field({ nullable: true }) WorkPhone?: string;
  @Field({ nullable: true }) employeeType?: string;

  // Work Address & Dates
  @Field({ nullable: true }) useCompanyAddress?: boolean;
  @Field({ nullable: true }) workAddress?: string;
  @Field({ nullable: true }) workState?: string;
  @Field({ nullable: true }) workZip?: string;
  @Field({ nullable: true }) workCity?: string;
  @Field({ nullable: true }) conformationDate?: string;
  @Field({ nullable: true }) noticeDate?: string;
  @Field({ nullable: true }) offerDate?: string;
  @Field({ nullable: true }) contractEndDate?: string;
  @Field({ nullable: true }) photo?: string;
  @Field({ nullable: true }) displayName?: string;

  @Field({ nullable: true }) citizenship?: string;
  @Field({ nullable: true }) signName?: string;

  @Field({ nullable: true }) otherCountryName?: string;

  @Field({ nullable: true }) uscis_alien_regis_number?: string;
  @Field({ nullable: true }) formi9?: string;
  @Field({ nullable: true }) foreignPassportNumber?: string;
  @Field({ nullable: true }) includeSSN?: boolean;

  // Termination
  @Field({ nullable: true }) terminateDate?: string;
  @Field({ nullable: true }) lastDaysWorked?: string;
  @Field({ nullable: true }) terminateType?: string;
  @Field({ nullable: true }) terminateDesc?: string;

  // Contact Info
  @Field({ nullable: true }) phoneNumber?: string;
  @Field({ nullable: true }) homePhone?: string;
  @Field({ nullable: true }) personalEmail?: string;
  @Field({ nullable: true }) preferredContactEmail?: string;

  // Home Address
  @Field({ nullable: true }) homeAddress?: string;
  @Field({ nullable: true }) homeCity?: string;
  @Field({ nullable: true }) homeState?: string;
  @Field({ nullable: true }) homeZipCode?: string;

  // Mailing Address
  @Field({ nullable: true }) mailingAddressIsTheSame?: boolean;
  @Field({ nullable: true }) mailingAddress?: string;
  @Field({ nullable: true }) mailingState?: string;
  @Field({ nullable: true }) mailingCity?: string;
  @Field({ nullable: true }) mailingZipCode?: string;

  // Emergency Contact
  @Field({ nullable: true }) emergencyContactName?: string;
  @Field({ nullable: true }) emergencyRelation?: string;
  @Field({ nullable: true }) emergencyPhone?: string;

  // Bank Info
  @Field({ nullable: true }) paymentMethod?: string;
  @Field({ nullable: true }) accountingNumber?: string;
  @Field({ nullable: true }) accountType?: string;
  @Field({ nullable: true }) accountBankName?: string;
  @Field({ nullable: true }) accountConfirmAccountingNumber?: string;
  @Field({ nullable: true }) accountConfirmRoutingNumber?: string;

  // Attendance & Shift
  @Field({ nullable: true }) attendanceDeviceIDBiometricRFtagID?: string;
  @Field({ nullable: true }) holidayList?: string;

  // 👇 Add this to expose shift
  @Field(() => Shift, { nullable: true })
  shift?: Shift;
  // @Field({ nullable: true }) shift?: string;

  // Tax Info (State & Federal)
  @Field({ nullable: true }) stateWhereTheEmployeeLives?: string;
  @Field({ nullable: true }) maritalStatus?: string;
  @Field({ nullable: true }) totalNumberOfAllowances_box_f?: string;
  @Field({ nullable: true }) additionalWithHolding?: string;
  @Field({ nullable: true }) exemptFromWithHolding_section_2NotExample?: string;
  @Field({ nullable: true }) IsThisEmployeeExemptFromMyState?: string;
  @Field({ nullable: true }) enterAmount?: number;
  @Field({ nullable: true })
  doesTheEmployeesWorkInTheStateWhereTheLives?: boolean;
  @Field({ nullable: true }) isThisEmployeeExemptFromMyState?: boolean;

  // W-4 Info
  @Field({ nullable: true }) which_W_4_DoesEmployeeHave?: string;
  @Field({ nullable: true }) WithHoldingStatus?: string;
  @Field({ nullable: true }) multipleJobsOrSpouseWorks?: string;
  @Field({ nullable: true }) claimDepends?: string;
  @Field({ nullable: true }) deductions?: string;
  @Field({ nullable: true }) otherIncome?: string;
  @Field({ nullable: true }) extraWithHolding?: string;
  @Field({ nullable: true }) exemptFromWithHolding?: string;
  @Field({ nullable: true }) isThisEmployeeExemptFromFederalTax?: string;
  @Field({ nullable: true }) employeeAccessToForm_W_4?: boolean;

  // Payroll Info

  @Field({ nullable: true }) overTime?: boolean;
  @Field({ nullable: true }) payType?: string;
  @Field({ nullable: true }) payFrequency?: string;
  @Field({ nullable: true }) salary?: string;
  @Field({ nullable: true }) hoursPerDay?: string;
  @Field({ nullable: true }) dayForWeek?: string;
  @Field({ nullable: true }) doubleOverTimePay?: boolean;
  @Field({ nullable: true }) holidayPay?: boolean;
  @Field({ nullable: true }) bonus?: boolean;

  // Array Fields
  @Field(() => [String], { nullable: true }) earning?: string[];
  @Field(() => [String], { nullable: true }) deduction_Contribution?: string[];
  @Field(() => [String], { nullable: true }) garnishment?: string[];
  @Field(() => [String], { nullable: true })
  educationalQualification?: string[];
  @Field(() => [String], { nullable: true }) previousWorkExperience?: string[];
  @Field(() => [String], { nullable: true }) historyInCompany?: string[];

  // Foreign Key
  @Field(() => Int)
  profileId: number;

  @Field(() => [String], { nullable: true })
  profileDetailsId?: String[];

  @Field({ nullable: true }) payScheduleID?: number;

  @Field(() => PaySchedule, { nullable: true })
  paySchedule?: PaySchedule;

  // Metadata
  @Field(() => Int, { nullable: true }) createdBy?: number;
  @Field({ nullable: true }) createdAt?: Date;
  @Field() updatedAt: Date;
}
