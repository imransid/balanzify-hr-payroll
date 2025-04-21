import { ObjectType, Field, Int } from "@nestjs/graphql";

@ObjectType()
export class GeneralSettings {
  @Field(() => Int)
  id: number;

  @Field({ nullable: true })
  calculatePayrollWorkingDaysBasedOn?: string;

  @Field({ nullable: true })
  includeHolidaysInTotalNoOfWorkingDays?: boolean;

  @Field({ nullable: true })
  maxWorkingHoursAgainstTimeSheet?: string;

  @Field({ nullable: true })
  fractionOfDailySalaryForHalfDay?: string;

  @Field({ nullable: true })
  disableRoundTotal?: boolean;

  @Field({ nullable: true })
  showLeaveBalancesInSalarySlip?: boolean;

  @Field({ nullable: true })
  encryptSalarySlipsInEmails?: boolean;

  @Field({ nullable: true })
  emailSalarySlipToEmployee?: boolean;

  @Field({ nullable: true })
  emailTemplate?: string;

  @Field({ nullable: true })
  processPayrollAccountingEntryBasedOnEmployee?: boolean;

  @Field(() => Int, { nullable: true })
  createdBy?: number;

  @Field({ nullable: true })
  createdAt?: Date;

  @Field({ nullable: true })
  updatedAt?: Date;
}
