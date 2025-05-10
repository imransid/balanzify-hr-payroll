import { ObjectType, Field, Int, Float } from "@nestjs/graphql";

@ObjectType()
class EmployeeDta {
  @Field(() => Int)
  federalTaxWithHoldingYearly: number;

  @Field(() => Int)
  medicareTax: number;

  @Field(() => Int)
  socialSecurityTax: number;

  @Field(() => Int)
  taxableIncome: number;

  @Field(() => Int)
  federalTaxWithHoldingMonthlyRate: number;

  @Field(() => Int)
  federalTaxWithHoldingWeeklyRate: number;
}

@ObjectType()
class EmployerDta {
  @Field(() => Int)
  medicareTax: number;

  @Field(() => Int)
  socialSecurityTax: number;

  @Field(() => Int)
  additionalMedicareTax: number;

  @Field(() => Int)
  futaTax: number;
}

@ObjectType()
class NetPaySummary {
  @Field(() => EmployeeDta)
  employeeDta: EmployeeDta;

  @Field(() => EmployerDta)
  employerDta: EmployerDta;
}

@ObjectType()
export class EmployeePayroll {
  @Field(() => Int)
  id: number;

  @Field()
  employeeName: string;

  @Field()
  workingHrs: string;

  @Field()
  rate: string;

  @Field()
  salary: string;

  @Field()
  OT: string;

  @Field()
  doubleOT: string;

  @Field()
  PTO: string;

  @Field()
  holidayPay: string;

  @Field()
  bonus: string;

  @Field()
  commission: string;

  @Field()
  total: string;

  @Field()
  grossPay: string;

  @Field(() => Int)
  netPay: number;

  @Field(() => Int)
  employeeContribution: number;

  @Field(() => Int)
  employeeDeduction: number;

  @Field(() => NetPaySummary, { nullable: true })
  netPaySummary?: NetPaySummary;

  @Field({ nullable: true })
  createdAt?: Date;

  @Field()
  updatedAt: Date;
}
