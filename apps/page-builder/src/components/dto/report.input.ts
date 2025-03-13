import { InputType, Field, PartialType, Int } from '@nestjs/graphql';

@InputType()
export class CreateReportInput {
  @Field()
  email: string;

  @Field()
  transactionId: string;

  @Field()
  mobile: string;

  @Field()
  result: string;
}

@InputType()
export class UpdateReportInput extends PartialType(CreateReportInput) {
  @Field(() => Int)
  id: number;
}
