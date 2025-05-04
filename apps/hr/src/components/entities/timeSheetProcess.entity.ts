import { ObjectType, Field, Int } from "@nestjs/graphql";

@ObjectType()
export class TimeSheetProcess {
  @Field(() => Int)
  id: number;

  @Field()
  employeeId: string;

  @Field()
  startTime: Date;

  @Field()
  endTime: Date;

  @Field()
  status: string;

  @Field()
  startProcessTime: Date;

  @Field()
  endProcessTIme: Date;

  @Field()
  dateType: string;

  @Field()
  remark: string;

  @Field()
  totalWorked: string;

  @Field(() => Int)
  profileId: number;

  @Field(() => Int, { nullable: true })
  createdBy?: number;

  @Field({ nullable: true })
  createdAt?: Date;

  @Field()
  updatedAt: Date;
}
