import { ObjectType, Field, Int } from "@nestjs/graphql";
import { PaySchedule } from "./paySchedule.entity";
import { Profile } from "./profile.entity";

@ObjectType()
export class EmployeeTaxRate {
  @Field()
  federalTaxWithHoldingYearly: number;

  @Field()
  medicareTax: number;

  @Field()
  socialSecurityTax: number;

  @Field()
  taxableIncome: number;

  @Field()
  federalTaxWithHoldingMonthlyRate: number;

  @Field()
  federalTaxWithHoldingWeeklyRate: number;
}

@ObjectType()
export class TaxRateEmployerSummary {
  @Field()
  medicareTax: number;

  @Field()
  socialSecurityTax: number;

  @Field()
  additionalMedicareTax: number;

  @Field()
  futaTax: number;
}

@ObjectType()
export class NetPaySummary {
  @Field(() => EmployeeTaxRate)
  employeeDta: EmployeeTaxRate;

  @Field(() => TaxRateEmployerSummary)
  employerDta: TaxRateEmployerSummary;
}

@ObjectType()
export class EmployeePayrollProcess {
  @Field(() => Int, { nullable: true })
  id?: number;

  @Field({ nullable: true })
  employeeName?: string;

  @Field({ nullable: true })
  workingHrs?: string;

  @Field({ nullable: true })
  Rate?: string;

  @Field({ nullable: true })
  Salary?: string;

  @Field({ nullable: true })
  OT?: string;

  @Field({ nullable: true })
  doubleOT?: string;

  @Field({ nullable: true })
  PTO?: string;

  @Field({ nullable: true })
  holydayPay?: string;

  @Field({ nullable: true })
  bonus?: string;

  @Field({ nullable: true })
  commission?: string;

  @Field({ nullable: true })
  total?: string;

  @Field({ nullable: true })
  employeeContribution?: number;

  @Field({ nullable: true })
  employeeDeduction?: number;

  @Field({ nullable: true })
  grossPay?: string;

  @Field({ nullable: true })
  netPay?: number;

  @Field(() => Profile, { nullable: true })
  profile?: Profile;

  @Field(() => PaySchedule, { nullable: true })
  paySchedule?: PaySchedule;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;

  @Field(() => NetPaySummary, { nullable: true })
  netPaySummary?: NetPaySummary;

  @Field(() => NetPaySummary, { nullable: true })
  storeNetPaySummary?: NetPaySummary;

  @Field({ nullable: true })
  profileID?: number;
}
