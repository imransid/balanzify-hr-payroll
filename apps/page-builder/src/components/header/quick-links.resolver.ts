import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { LatestNews } from '../entities/latest-news.entity';
import { AuthGuard } from 'apps/user-service/src/guard/auth.guard';
import { UseGuards } from '@nestjs/common';
import { QuickLinks } from '../entities/quick-links.entity';
import { QuickLinksService } from './quick-links.service';
import { CreateQuickLinksInput } from '../dto/create-quick-links.input';
import {  UpdateQuickLinksInput } from '../dto/update-quick-links.input';

@Resolver(() => QuickLinks)
export class QuickLinksResolver {
  constructor(private readonly quickLinksService: QuickLinksService) {}

  @UseGuards(AuthGuard)
  @Mutation(() => QuickLinks)
  createQuickLinks(@Args('createQuickLinksInput') createQuickLinksInput: CreateQuickLinksInput) {
    return this.quickLinksService.create(createQuickLinksInput);
  }

  @Query(() => [QuickLinks], { name: 'allQuickLinks' })
  findAll(@Args('page') page:number, @Args('limit') limit:number) {
    return this.quickLinksService.findAll(page,limit);
  }

  @Query(() => QuickLinks, { name: 'quickLink' })
  findOne(@Args('id', { type: () => Int }) id: number) {
    return this.quickLinksService.findOne(id);
  }

  @UseGuards(AuthGuard)
  @Mutation(() => QuickLinks)
  updateQuickLinks(@Args('updateQuickLinksInput') updateQuickLinksInput: UpdateQuickLinksInput) {
    return this.quickLinksService.update(updateQuickLinksInput.id, updateQuickLinksInput);
  }

  @UseGuards(AuthGuard)
  @Mutation(() => QuickLinks)
  removeQuickLinks(@Args('id', { type: () => Int }) id: number) {
    return this.quickLinksService.remove(id);
  }
}
