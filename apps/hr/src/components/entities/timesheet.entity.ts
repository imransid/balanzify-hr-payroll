import { ObjectType, Field, Int } from "@nestjs/graphql";

@ObjectType()
export class TimeSheet {
  @Field(() => Int)
  id: number;

  @Field(() => Int)
  employeeId: number;

  @Field()
  remarks: string;

  @Field()
  startTime: Date;

  @Field()
  endTime: Date;

  @Field()
  startProcessDate: Date;

  @Field()
  endProcessDate: Date;

  @Field()
  totalTime: string;

  @Field(() => Int, { nullable: true })
  createdBy?: number;

  @Field({ nullable: true })
  createdAt?: Date;

  @Field({ nullable: true })
  updatedAt?: Date;
}
