import { ObjectType, Field, Int } from "@nestjs/graphql";

@ObjectType()
export class LeaveType {
  @Field(() => Int)
  id: number;

  // Basic
  @Field()
  leaveName: string;

  @Field()
  displayName: string;

  @Field()
  definition: string;

  @Field()
  color: string;

  @Field()
  leaveTypeHourly: number;

  @Field()
  leaveTypeMaxHour: number;

  // Leave Allocation
  @Field()
  maxLeaveAllocation: number;

  @Field()
  allowLeaveApplicationAfter: number;

  @Field()
  maxConsecutiveLeave: number;

  // Carry Forward
  @Field({ nullable: true })
  maxCarryForwardedLeaves?: number;

  @Field({ nullable: true })
  expireCarryForwardedLeaves?: number;

  // Encashment
  @Field()
  allowEncashment: boolean;

  @Field({ nullable: true })
  maxEncashableLeaves?: number;

  @Field({ nullable: true })
  minEncashableLeaves?: number;

  @Field({ nullable: true })
  earningComponents?: string;

  // Earned Leaves
  @Field()
  isEarnedLeaves: boolean;

  @Field({ nullable: true })
  earnLeaveFragrancy?: string;

  @Field({ nullable: true })
  allocatedOnDays?: string;

  @Field({ nullable: true })
  Rounders?: string;

  // Extras
  @Field()
  isLeaveWithoutPay: boolean;

  @Field()
  isOptionalLeaves: boolean;

  @Field()
  allowNegativeBalance: boolean;

  @Field()
  allowOverAllocation: boolean;

  @Field()
  includeHolidaysWithinLeavesONLeave: boolean;

  @Field()
  isCompensatory: boolean;
}
