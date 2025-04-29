import { ObjectType, Field, Int } from "@nestjs/graphql";
import { LeaveType } from "./leaveType.entity";

@ObjectType()
export class LeaveEncashment {
  @Field(() => Int)
  id: number;

  @Field()
  empId: string;

  @Field()
  employeeName: string;

  @Field()
  leavePeriod: string;

  @Field()
  leaveYear: string;

  @Field()
  currency: string;

  @Field()
  designation: string;

  @Field()
  department: string;

  @Field()
  leaveBalancePeriod: string;

  @Field()
  encashmentDate: Date;

  // ✅ Many-to-many relation with LeaveType
  @Field(() => [LeaveType])
  leaveTypes: LeaveType[];

  @Field(() => Int, { nullable: true })
  createdBy?: number;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}
