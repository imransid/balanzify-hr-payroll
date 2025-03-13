import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { ReportService } from './report.service';
import { Report } from '../entities/report.entity';
import { StandardResponse } from '../dto/standard-response.dto';
import { CreateReportInput, UpdateReportInput } from '../dto/report.input';

@Resolver(() => Report)
export class ReportResolver {
  constructor(private readonly reportService: ReportService) {}

  // Mutation to create a new question
  @Mutation(() => Report)
  createReport(
    @Args('createReportInput') createReportInput: CreateReportInput,
  ): Promise<Report> {
    return this.reportService.create(createReportInput);
  }

  // Query to retrieve all Report with pagination
  @Query(() => [Report])
  async findAllReport(
    @Args('page', { type: () => Int, nullable: true }) page?: number,
    @Args('limit', { type: () => Int, nullable: true }) limit?: number,
  ): Promise<Report[]> {
    let qusRes = await this.reportService.findAll(page || 1, limit || 10);

    console.log(qusRes, 'qusRes');

    return qusRes;
  }

  // Query to retrieve a single Report by ID
  @Query(() => Report)
  findReport(@Args('id', { type: () => Int }) id: number): Promise<Report> {
    return this.reportService.findOne(id);
  }

  // Mutation to update a Report
  @Mutation(() => Report)
  updateReport(
    @Args('id', { type: () => Int }) id: number,
    @Args('updateReportInput') updateReportInput: UpdateReportInput,
  ): Promise<Report> {
    return this.reportService.update(id, updateReportInput);
  }

  @Mutation(() => StandardResponse)
  async removeReport(
    @Args('id', { type: () => Int }) id: number,
  ): Promise<StandardResponse> {
    await this.reportService.remove(id);
    return { success: true, message: 'Report successfully deleted' };
  }
}
