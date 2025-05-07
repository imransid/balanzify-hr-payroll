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
