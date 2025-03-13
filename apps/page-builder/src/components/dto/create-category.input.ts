import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class CreateCategory {
  @Field()
  category: string;
}