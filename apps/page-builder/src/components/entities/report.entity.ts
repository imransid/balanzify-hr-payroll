import { ObjectType, Field, Int } from '@nestjs/graphql';

@ObjectType()
export class Report {
  @Field(() => Int)
  id: number;

  @Field()
  email: string;

  @Field()
  transactionId: string;

  @Field()
  mobile: string;

  @Field()
  result: string;
}
