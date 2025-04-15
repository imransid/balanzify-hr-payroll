import { ObjectType, Field, Int } from "@nestjs/graphql";

@ObjectType()
export class PaySchedule {
  @Field(() => Int)
  id: number;

  @Field()
  title: string;

  @Field()
  payFrequency: string;

  @Field()
  nextPayDay: string;

  @Field()
  endOfNextPayPeriod: string;

  @Field()
  isDefault: boolean;

  @Field({ nullable: true })
  firstPayDayOfTheMonth?: string;

  @Field({ nullable: true })
  endOfFirstPayPeriod?: string;

  @Field({ nullable: true })
  dayBeforePayDayFirstPayOFMonth?: string;

  @Field({ nullable: true })
  month?: string;

  @Field({ nullable: true })
  secondPayDayOfTheMonth?: string;

  @Field({ nullable: true })
  endOfSecondPayPeriod?: string;

  @Field({ nullable: true })
  months?: string;

  @Field({ nullable: true })
  dayBeforePayDayFirstPayOFSecond?: string;

  @Field({ nullable: true })
  firstPayDayOfTheMonthTwice?: string;

  @Field({ nullable: true })
  endOfFirstPayPeriodTwice?: string;

  @Field({ nullable: true })
  dayBeforePayDayTwice?: string;

  @Field({ nullable: true })
  createdBy?: number;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}
