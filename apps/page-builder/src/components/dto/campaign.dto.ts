import { InputType, Field, Int, PartialType } from '@nestjs/graphql';

@InputType()
export class CreateCampaignDto {
  @Field()
  campaign: string;

  @Field()
  code: string;

  @Field()
  url: string;
}

@InputType()
export class UpdateCampaignDto extends PartialType(CreateCampaignDto) {
  @Field(() => Int)
  id: number;
}
