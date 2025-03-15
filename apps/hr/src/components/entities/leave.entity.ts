import { ObjectType, Field, Int } from '@nestjs/graphql';

@ObjectType()
export class Leave {
  @Field(() => Int)
  id: number;

  @Field()
  leaveName: string;

  @Field()
  displayName: string;

  @Field()
  definition: string;

  @Field()
  color: string;

  @Field()
  leaveType: string;

  @Field(() => Int)
  maxLeaveAllocation: number;

  @Field()
  status: boolean;
}
