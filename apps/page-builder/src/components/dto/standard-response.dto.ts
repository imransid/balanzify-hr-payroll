import { ObjectType, Field } from '@nestjs/graphql';

@ObjectType()
export class StandardResponse {
  @Field()
  success: boolean;

  @Field({ nullable: true })
  message?: string;
}
