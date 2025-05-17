import { ObjectType, Field, Int } from "@nestjs/graphql";

@ObjectType()
export class EmployeeLeave {
  @Field(() => Int)
  id: number;

  @Field({ nullable: true })
  leaveType?: string;

  @Field(() => Int, { nullable: true })
  totalDays?: number;

  @Field(() => Int, { nullable: true })
  deskLookByEmployeeID?: number;

  @Field({ nullable: true })
  deskLookByEmployeeName?: string;

  @Field({ nullable: true })
  note?: string;

  @Field({ nullable: true })
  fromDate?: Date;

  @Field({ nullable: true })
  toDate?: Date;

  @Field({ nullable: true })
  status?: string;

  @Field({ nullable: true })
  docUrl?: string;

  @Field(() => Int, { nullable: true })
  leaveBalanceId?: number;

  @Field(() => Int, { nullable: true })
  leaveTypeId?: number;

  @Field(() => Int, { nullable: true })
  profileId?: number;
}
