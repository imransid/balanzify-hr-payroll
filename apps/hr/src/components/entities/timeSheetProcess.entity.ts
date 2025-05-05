import { ObjectType, Field, Int } from "@nestjs/graphql";
import { Shift } from "./shift.entity";

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

  @Field(() => String, { nullable: true })
  profileName?: string;

  @Field(() => Int)
  profileId: number;

  @Field(() => Int, { nullable: true })
  createdBy?: number;

  @Field({ nullable: true })
  createdAt?: Date;

  @Field()
  updatedAt: Date;

  // 👇 Add this to expose shift
  @Field(() => Shift, { nullable: true })
  shift?: Shift;
}
