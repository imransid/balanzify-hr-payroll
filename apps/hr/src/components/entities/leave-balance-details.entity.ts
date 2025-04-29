import { ObjectType, Field, Int } from "@nestjs/graphql";
import { LeaveBalance } from "./leaveBalance.entity";

@ObjectType()
export class LeaveBalanceDetails {
  @Field(() => Int)
  id: number;

  @Field(() => Int, { nullable: true })
  leaveBalanceId?: number;

  @Field(() => LeaveBalance, { nullable: true })
  leaveBalance?: LeaveBalance;

  @Field(() => Int, { nullable: true })
  createdBy?: number;

  @Field({ nullable: true })
  createdAt?: Date;

  @Field()
  updatedAt: Date;
}
