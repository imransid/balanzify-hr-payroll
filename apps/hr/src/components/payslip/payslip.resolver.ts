import { Resolver, Query, Args, Int } from "@nestjs/graphql";
import { PayslipService } from "./payslip.service";
import { GraphQLException } from "exceptions/graphql-exception";
import { GraphQLJSONObject } from "graphql-type-json";

@Resolver()
export class PayslipResolver {
  constructor(private readonly payslipService: PayslipService) {}

  // Fetch paginated payslips
  @Query(() => GraphQLJSONObject)
  async payslips(
    @Args("page", { type: () => Int, nullable: true, defaultValue: 1 })
    page: number,
    @Args("limit", { type: () => Int, nullable: true, defaultValue: 10 })
    limit: number
  ): Promise<any> {
    try {
      let data = await this.payslipService.findAll(page, limit);

      console.log(data);

      return data;
    } catch (error) {
      throw new GraphQLException(
        "Failed to fetch payslips",
        "INTERNAL_SERVER_ERROR"
      );
    }
  }

  // Fetch single payslip by ID
  @Query(() => GraphQLJSONObject)
  async payslip(@Args("id", { type: () => Int }) id: number): Promise<any> {
    try {
      return await this.payslipService.findOne(id);
    } catch (error) {
      throw new GraphQLException(
        `Payslip with ID ${id} not found`,
        error?.status === 404 ? "NOT_FOUND" : "INTERNAL_SERVER_ERROR"
      );
    }
  }

  // Search payslips with query
  @Query(() => GraphQLJSONObject)
  async searchPayslips(
    @Args("query", { type: () => String }) query: string,
    @Args("page", { type: () => Int, nullable: true, defaultValue: 1 })
    page: number,
    @Args("limit", { type: () => Int, nullable: true, defaultValue: 10 })
    limit: number
  ): Promise<any> {
    try {
      return await this.payslipService.search(query, page, limit);
    } catch (error) {
      throw new GraphQLException(
        "Failed to search payslips",
        "INTERNAL_SERVER_ERROR"
      );
    }
  }
}
