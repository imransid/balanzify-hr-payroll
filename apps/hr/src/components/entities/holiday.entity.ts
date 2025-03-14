// src/campaign/entities/campaign.entity.ts
import { ObjectType, Field, Int } from '@nestjs/graphql';

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
}
