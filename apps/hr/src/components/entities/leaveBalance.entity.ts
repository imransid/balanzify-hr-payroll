import { ObjectType, Field, Int } from "@nestjs/graphql";
import { LeaveBalanceDetails } from "./leave-balance-details.entity";

@ObjectType()
export class LeaveBalance {
  @Field(() => Int)
  id: number;

  @Field({ nullable: true })
  title?: string;

  @Field({ nullable: true })
  leaveYear?: Date;

  @Field({ nullable: true })
  fromDate?: Date;

  @Field({ nullable: true })
  toDate?: Date;

  @Field(() => Int, { nullable: true })
  createdBy?: number;

  @Field({ nullable: true })
  createdAt?: Date;

  @Field()
  updatedAt: Date;

  @Field(() => [LeaveBalanceDetails], { nullable: true })
  details?: LeaveBalanceDetails[];
}
