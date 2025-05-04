import { ObjectType, Field, Int } from "@nestjs/graphql";

@ObjectType()
export class TimeSheet {
  @Field(() => Int, { nullable: true })
  @Field(() => Int)
  id: number;

  @Field(() => Int)
  employeeId: number;

  @Field({ nullable: true })
  remarks?: string;

  @Field({ nullable: true })
  startTime?: Date;

  @Field({ nullable: true })
  endTime?: Date;

  @Field({ nullable: true })
  startProcessDate?: Date;

  @Field({ nullable: true })
  endProcessDate?: Date;

  @Field({ nullable: true })
  totalTime?: string;

  @Field(() => Int, { nullable: true })
  createdBy?: number;

  @Field({ nullable: true })
  createdAt?: Date;

  @Field({ nullable: true })
  status?: string;

  @Field({ nullable: true })
  updatedAt?: Date;
}
