import { ObjectType, Field, Int } from "@nestjs/graphql";

@ObjectType()
export class Designation {
  @Field(() => Int)
  id: number;

  @Field()
  designationName: string;

  @Field()
  designation: string;
}
