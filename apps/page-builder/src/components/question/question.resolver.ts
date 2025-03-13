import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { QuestionService } from './question.service';
import { Question, QuestionResponse } from '../entities/question.entity';
import { UpdateQuestionInput } from '../dto/answer.input';

import { StandardResponse } from '../dto/standard-response.dto';
import { CreateQuestionInput } from '../dto/question.input';

@Resolver(() => Question)
export class QuestionResolver {
  constructor(private readonly questionService: QuestionService) {}

  // Mutation to create a new question
  @Mutation(() => Question)
  createQuestion(
    @Args('createQuestionInput') createQuestionInput: CreateQuestionInput,
  ): Promise<Question> {
    return this.questionService.create(createQuestionInput);
  }

  // Query to retrieve all questions with pagination
  @Query(() => [QuestionResponse])
  async findAllQuestions(
    @Args('page', { type: () => Int, nullable: true }) page?: number,
    @Args('limit', { type: () => Int, nullable: true }) limit?: number,
  ): Promise<QuestionResponse[]> {
    let qusRes = await this.questionService.findAll(page || 1, limit || 10);
    return qusRes;
  }

  // Query to retrieve a single question by ID
  @Query(() => Question)
  findQuestion(@Args('id', { type: () => Int }) id: number): Promise<Question> {
    return this.questionService.findOne(id);
  }

  // Mutation to update a question
  @Mutation(() => Question)
  updateQuestion(
    @Args('id', { type: () => Int }) id: number,
    @Args('updateQuestionInput') updateQuestionInput: UpdateQuestionInput,
  ): Promise<Question> {
    return this.questionService.update(id, updateQuestionInput);
  }

  // Mutation to delete a question
  @Mutation(() => StandardResponse)
  async removeQuestion(
    @Args('id', { type: () => Int }) id: number,
  ): Promise<StandardResponse> {
    await this.questionService.remove(id);
    return { success: true, message: 'Question successfully deleted' };
  }

  // Mutation to delete a specific answer
  @Mutation(() => StandardResponse)
  async removeAnswer(
    @Args('id', { type: () => Int }) id: number,
  ): Promise<StandardResponse> {
    await this.questionService.removeAnswer(id);
    return { success: true, message: 'Answer successfully deleted' };
  }
}
