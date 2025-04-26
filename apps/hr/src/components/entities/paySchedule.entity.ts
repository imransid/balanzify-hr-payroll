import { ObjectType, Field, Int } from "@nestjs/graphql";
import { FrequencyType } from "../../prisma/OnboardingType.enum";

@ObjectType()
export class PaySchedule {
  @Field(() => Int)
  id: number;

  @Field()
  payScheduleName: string;

  @Field(() => FrequencyType, {
    defaultValue: FrequencyType.EVERY_MONTH,
  })
  payFrequency: keyof typeof FrequencyType;

  @Field()
  isDefaultForNewEmployees: boolean;

  @Field({ nullable: true })
  nextPayDay?: Date;

  @Field({ nullable: true })
  endOfNextPayPeriod?: Date;

  // Monthly Pay Fields
  @Field({ nullable: true })
  firstPayPeriodOfTheMonth?: string;

  @Field({ nullable: true })
  paydayOfTheMonth?: string;

  @Field({ nullable: true })
  endOfEachMonthPayPeriodTimeLine?: string;

  @Field({ nullable: true })
  endOfEachMonthPayDay?: string;

  @Field({ nullable: true })
  daysBeforePayday?: string;

  // Twice a Month Pay Fields
  @Field({ nullable: true })
  secondPayPeriodOfTheMonth?: string;

  @Field({ nullable: true })
  secondPaydayOfTheMonth?: string;

  @Field({ nullable: true })
  secondEndOfEachMonthPayPeriodTimeLine?: string;

  @Field({ nullable: true })
  secondEndOfEachMonthPayDay?: string;

  @Field({ nullable: true })
  secondDaysBeforePayday?: string;

  @Field({ nullable: true })
  createdBy?: number;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}
