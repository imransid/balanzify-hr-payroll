// import { ObjectType, Field, Int } from "@nestjs/graphql";
// import { StatusType } from "../../prisma/OnboardingType.enum";

// @ObjectType()
// export class LeaveType {
//   @Field(() => Int)
//   id: number;

//   // Basic
//   @Field()
//   leaveName: string;

//   @Field()
//   displayName: string;

//   @Field()
//   definition: string;

//   @Field()
//   color: string;

//   @Field()
//   leaveTypeHourly: number;

//   @Field()
//   leaveTypeMaxHour: number;

//   // Leave Allocation
//   @Field()
//   maxLeaveAllocation: number;

//   @Field()
//   allowLeaveApplicationAfter: number;

//   @Field()
//   maxConsecutiveLeave: number;

//   // Carry Forward
//   @Field({ nullable: true })
//   maxCarryForwardedLeaves?: number;

//   @Field({ nullable: true })
//   expireCarryForwardedLeaves?: number;

//   // Encashment
//   @Field()
//   allowEncashment: boolean;

//   @Field({ nullable: true })
//   maxEncashableLeaves?: number;

//   @Field({ nullable: true })
//   minEncashableLeaves?: number;

//   @Field({ nullable: true })
//   earningComponents?: string;

//   // Earned Leaves
//   @Field()
//   isEarnedLeaves: boolean;

//   @Field({ nullable: true })
//   earnLeaveFragrancy?: string;

//   @Field({ nullable: true })
//   allocatedOnDays?: string;

//   @Field({ nullable: true })
//   Rounders?: string;

//   // Extras
//   @Field()
//   isLeaveWithoutPay: boolean;

//   @Field()
//   isOptionalLeaves: boolean;

//   @Field()
//   allowNegativeBalance: boolean;

//   @Field()
//   allowOverAllocation: boolean;

//   @Field()
//   includeHolidaysWithinLeavesONLeave: boolean;

//   @Field()
//   isCompensatory: boolean;

//   @Field(() => StatusType, {
//     defaultValue: StatusType.DE_ACTIVE,
//   })
//   status: keyof typeof StatusType;
// }

import { ObjectType, Field, Int } from "@nestjs/graphql";
import { StatusType } from "../../prisma/OnboardingType.enum";

@ObjectType()
export class LeaveType {
  @Field(() => Int)
  id: number;

  @Field({ nullable: true })
  selectLeave?: string;

  // Basic
  @Field({ nullable: true })
  leaveName?: string;

  @Field({ nullable: true })
  displayName?: string;

  @Field({ nullable: true })
  definition?: string;

  @Field({ nullable: true })
  color?: string;

  @Field({ nullable: true })
  leaveTypeHourly?: number;

  @Field({ nullable: true })
  leaveTypeMaxHour?: number;

  // Leave Allocation
  @Field({ nullable: true })
  maxLeaveAllocation?: number;

  @Field({ nullable: true })
  allowLeaveApplicationAfter?: number;

  @Field({ nullable: true })
  maxConsecutiveLeave?: number;

  // Carry Forward
  @Field({ nullable: true })
  maxCarryForwardedLeaves?: number;

  @Field({ nullable: true })
  expireCarryForwardedLeaves?: number;

  // Encashment
  @Field({ nullable: true })
  allowEncashment?: boolean;

  @Field({ nullable: true })
  maxEncashableLeaves?: number;

  @Field({ nullable: true })
  minEncashableLeaves?: number;

  @Field({ nullable: true })
  earningComponents?: string;

  // Earned Leaves
  @Field({ nullable: true })
  isEarnedLeaves?: boolean;

  @Field({ nullable: true })
  earnLeaveFragrancy?: string;

  @Field({ nullable: true })
  allocatedOnDays?: string;

  @Field({ nullable: true })
  Rounders?: string;

  // Extras
  @Field({ nullable: true })
  isLeaveWithoutPay?: boolean;

  @Field({ nullable: true })
  isOptionalLeaves?: boolean;

  @Field({ nullable: true })
  allowNegativeBalance?: boolean;

  @Field({ nullable: true })
  allowOverAllocation?: boolean;

  @Field({ nullable: true })
  includeHolidaysWithinLeavesONLeave?: boolean;

  @Field({ nullable: true })
  isCompensatory?: boolean;

  @Field(() => StatusType, {
    nullable: true,
    defaultValue: StatusType.DE_ACTIVE,
  })
  status?: keyof typeof StatusType;
}
