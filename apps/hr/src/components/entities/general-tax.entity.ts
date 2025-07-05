import { ObjectType, Field, Int } from "@nestjs/graphql";

@ObjectType()
export class GeneralTax {
  @Field(() => Int)
  id: number;

  @Field({ nullable: true })
  companyLegalName?: string;

  @Field({ nullable: true })
  companyType?: string;

  @Field({ nullable: true })
  state1?: string;

  @Field({ nullable: true })
  city?: string;

  @Field({ nullable: true })
  streetAddress1?: string;

  @Field({ nullable: true })
  zipCode?: string;

  @Field({ nullable: true })
  state2?: string;

  @Field({ nullable: true })
  streetAddress2?: string;

  @Field({ nullable: true })
  state3?: string;

  @Field({ nullable: true })
  companyId?: string;

  @Field({ nullable: true })
  ein?: string;

  @Field(() => Int, { nullable: true })
  profileId?: number;
}
