import { ObjectType, Field, Int } from "@nestjs/graphql";
import { LeaveBalance } from "./leaveBalance.entity";

@ObjectType()
export class LeaveBalanceDetails {
  @Field(() => Int)
  id: number;

  @Field({ nullable: true })
  EMPCode?: string;

  @Field({ nullable: true })
  EMPName?: string;

  @Field({ nullable: true })
  Sick?: string;

  @Field({ nullable: true })
  Casual?: string;

  @Field({ nullable: true })
  Earn?: string;

  @Field({ nullable: true })
  LWP?: string;

  @Field({ nullable: true })
  PL?: string;

  @Field({ nullable: true })
  CO?: string;

  @Field({ nullable: true })
  ShortL?: string;

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
