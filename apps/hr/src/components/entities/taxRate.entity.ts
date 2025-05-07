import { ObjectType, Field, Int } from "@nestjs/graphql";

@ObjectType()
export class TaxRate {
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
export class TaxRateEmployer {
  @Field()
  futaTax: number;

  @Field()
  additionalMedicareTax: number;

  @Field()
  socialSecurityTax: number;

  @Field()
  medicareTax: number;
}

export interface EmployeeTaxData {
  federalTaxWithHoldingYearly: number;
  taxableIncome: number;
  medicareTax: number;
  socialSecurityTax: number;
  federalTaxWithHoldingMonthlyRate: number;
  federalTaxWithHoldingWeeklyRate: number;
}

export interface EmployerTaxData {
  medicareTax: number;
  socialSecurityTax: number;
  additionalMedicareTax: number;
  futaTax: number;
}

export interface NetPaySummary {
  employeeDta: EmployeeTaxData;
  employerDta: EmployerTaxData;
}
