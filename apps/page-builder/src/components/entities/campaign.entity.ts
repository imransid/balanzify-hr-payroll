// src/campaign/entities/campaign.entity.ts
import { ObjectType, Field, Int } from '@nestjs/graphql';

@ObjectType()
export class Campaign {
  @Field(() => Int)
  id: number;

  @Field()
  campaign: string;

  @Field()
  code: string;

  @Field()
  url: string;
}
