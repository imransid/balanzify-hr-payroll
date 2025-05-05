import { ObjectType, Field, Int } from "@nestjs/graphql";

@ObjectType()
export class Holiday {
  @Field(() => Int)
  id: number;

  @Field()
  name: string;

  @Field()
  toDate: Date;

  @Field()
  fromDate: Date;

  @Field()
  country: string;

  @Field()
  weekend: string;

  @Field()
  totalHoliday: string;

  @Field()
  status: boolean;

  @Field()
  color: string;

  @Field(() => [HolidayDetails], { nullable: true })
  details?: HolidayDetails[];
}

@ObjectType()
export class HolidayDetails {
  @Field(() => Int)
  id: number;

  @Field(() => Int, { nullable: true })
  No?: number;

  @Field()
  Date: Date;

  @Field({ nullable: true })
  Type?: string;

  @Field({ nullable: true })
  Description?: string;

  @Field(() => Int)
  holidayId: number;

  @Field(() => Holiday, { nullable: true })
  holiday?: Holiday;
}
