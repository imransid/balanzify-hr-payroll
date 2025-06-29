import { ObjectType, Field, Int } from "@nestjs/graphql";
import { Shift } from "./shift.entity";

@ObjectType()
export class TimeSheetProcess {
  @Field(() => Int)
  id: number;

  @Field()
  companyId: string;

  @Field({ nullable: true })
  employeeId: string;

  @Field({ nullable: true })
  startTime: Date;

  @Field({ nullable: true })
  endTime: Date;

  @Field({ nullable: true })
  status: string;

  @Field({ nullable: true })
  startProcessTime: Date;

  @Field({ nullable: true })
  endProcessTIme: Date;

  @Field({ nullable: true })
  dateType: string;

  @Field({ nullable: true })
  remark: string;

  @Field({ nullable: true })
  totalWorked: string;

  @Field(() => String, { nullable: true })
  profileName?: string;

  @Field(() => Int)
  profileId: number;

  @Field(() => Int, { nullable: true })
  createdBy?: number;

  @Field({ nullable: true })
  createdAt?: Date;

  @Field({ nullable: true })
  updatedAt: Date;

  // 👇 Add this to expose shift
  @Field(() => Shift, { nullable: true })
  shift?: Shift;
}
