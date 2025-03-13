// src/campaign/campaign.resolver.ts
import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { CampaignService } from './campaign.service';
import { Campaign } from '../entities/campaign.entity';
import { CreateCampaignDto, UpdateCampaignDto } from '../dto/campaign.dto';

@Resolver(() => Campaign)
export class CampaignResolver {
  constructor(private readonly campaignService: CampaignService) {}

  @Mutation(() => Campaign)
  createCampaign(@Args('data') data: CreateCampaignDto) {
    return this.campaignService.create(data);
  }

  @Query(() => [Campaign])
  findAllCampaigns() {
    return this.campaignService.findAll();
  }

  @Query(() => Campaign, { nullable: true })
  findCampaignById(@Args('id', { type: () => Int }) id: number) {
    return this.campaignService.findOne(id);
  }

  @Mutation(() => Campaign)
  updateCampaign(
    @Args('id', { type: () => Int }) id: number,
    @Args('data') data: UpdateCampaignDto,
  ) {
    return this.campaignService.update(id, data);
  }

  @Mutation(() => Campaign)
  removeCampaign(@Args('id', { type: () => Int }) id: number) {
    return this.campaignService.remove(id);
  }
}
