import { Resolver, Query, Mutation, Args, Int, Context } from '@nestjs/graphql';
import { ImportantDatesService } from './important-dates.service';
import { ImportantDates } from '../entities/important.dates.entity';
import { CreateImportantDatesInput } from '../dto/create-important-dates.input';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from 'apps/user-service/src/guard/auth.guard';
import { UpdateImportantDatesInput } from '../dto/update-important-dates.input';

@Resolver(() => ImportantDates)
export class ImportantDatesResolver {
  constructor(private readonly importantDatesService: ImportantDatesService) {}

  @UseGuards(AuthGuard)
  @Mutation(() => ImportantDates)
  async createImportantDates(
    @Args('createImportantDates')
    createImportantDatesInput: CreateImportantDatesInput,
    @Context() ctx,
  ): Promise<ImportantDates> {
    const userId = ctx.user.id;
    return this.importantDatesService.create(createImportantDatesInput, userId);
  }

  @UseGuards(AuthGuard)
  @Query(() => [ImportantDates], { name: 'importantDates' })
  async findAllImportantDates(
    @Args('page', { type: () => Number, nullable: true }) page: number = 1,
    @Args('limit', { type: () => Number, nullable: true }) limit: number = 10,
  ) {
    return this.importantDatesService.findAll(page, limit);
  }
  /**
   * Get a single important date by ID
   */
  @UseGuards(AuthGuard)
  @Query(() => ImportantDates, { name: 'importantDate' })
  async findOneImportantDate(@Args('id', { type: () => Int }) id: number) {
    return this.importantDatesService.findOne(id);
  }

  /**
   * Update an important date entry
   */
  @UseGuards(AuthGuard)
  @Mutation(() => ImportantDates)
  async updateImportantDate(
    @Args('id', { type: () => Int }) id: number,
    @Args('updateImportantDatesInput')
    updateImportantDatesInput: UpdateImportantDatesInput,
    @Context() ctx,
  ) {
    const userId = ctx.user.id;

    return this.importantDatesService.update(
      id,
      updateImportantDatesInput,
      userId,
    );
  }

  @UseGuards(AuthGuard)
  @Mutation(() => ImportantDates)
  async deleteImportantDate(@Args('id', { type: () => Int }) id: number) {
    return this.importantDatesService.delete(id);
  }
}
