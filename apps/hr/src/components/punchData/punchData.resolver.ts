import { Resolver, Query, Mutation, Args, Int } from "@nestjs/graphql";
import { PunchDataService } from "./punchData.service";
import {
  CreatePunchDataInput,
  //   UpdatePunchDataInput,
  //   PunchDataPaginatedResult,
} from "../dto/punchData.input";
// import { PunchData } from "../entities/punch-data.entity";
import { NotFoundException } from "@nestjs/common";
import { GraphQLException } from "exceptions/graphql-exception";
import { TimeSheet } from "../entities/timesheet.entity";

@Resolver(() => TimeSheet)
export class PunchDataResolver {
  constructor(private readonly punchDataService: PunchDataService) {}

  @Mutation(() => TimeSheet)
  async createPunchData(
    @Args("createPunchDataInput") createPunchDataInput: CreatePunchDataInput
  ): Promise<TimeSheet> {
    try {
      return await this.punchDataService.create(createPunchDataInput);
    } catch (error) {
      throw new GraphQLException(
        "Failed to create punch data" + error.toString(),
        "INTERNAL_SERVER_ERROR"
      );
    }
  }
}
