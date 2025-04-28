import { Field, ObjectType } from "@nestjs/graphql";

@ObjectType()
export class Tax {
  @Field()
  totalTax: number;

  @Field()
  taxableIncome: number;
}
