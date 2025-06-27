import { ObjectType, Field, Int } from "@nestjs/graphql";

@ObjectType()
export class DeductionContribution {
  @Field(() => Int)
  id: number;

  @Field()
  title: string;

  @Field()
  deductionContributionType: string;

  @Field()
  type: string;

  @Field()
  taxOptions: string;

  @Field()
  status: boolean;

  @Field()
  companyId: string;
}
