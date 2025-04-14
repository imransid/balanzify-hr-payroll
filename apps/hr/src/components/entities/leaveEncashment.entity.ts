import { ObjectType, Field, Int } from "@nestjs/graphql";

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
  leaveTypeID: number;
}
