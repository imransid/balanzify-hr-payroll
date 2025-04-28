import { ObjectType, Field, Int } from "@nestjs/graphql";

@ObjectType()
export class TaxRate {
  @Field()
  federalTaxWithHolding: number;

  @Field()
  medicareTax: number;

  @Field()
  socialSecurityTax: number;

  @Field()
  taxableIncome: number;
}
