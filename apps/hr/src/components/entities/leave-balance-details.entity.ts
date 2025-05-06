import { ObjectType, Field, Int } from "@nestjs/graphql";
import { LeaveBalance } from "./leaveBalance.entity";

@ObjectType()
export class LeaveBalanceDetails {
  @Field(() => Int)
  id: number;

  @Field(() => Int, { nullable: true })
  createdBy?: number;

  @Field(() => Int, { nullable: true })
  companyId?: number;

  @Field(() => String, { nullable: true })
  leaveBalances?: string; // Holds EMPCode, EMPName, and leave type values

  @Field(() => Int, { nullable: true })
  leaveBalanceId?: number;

  @Field(() => LeaveBalance, { nullable: true })
  leaveBalance?: LeaveBalance;
}
