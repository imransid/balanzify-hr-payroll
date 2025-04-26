import { Resolver, Query, Mutation, Args, Int } from "@nestjs/graphql";
import { PayrollTaxService } from "./payroll-tax.service";
import { GraphQLException } from "exceptions/graphql-exception";
import { TaxRate } from "../entities/taxRate.entity";

@Resolver(() => TaxRate)
export class PayrollTaxResolver {
  constructor(private readonly payrollTaxService: PayrollTaxService) {}

  @Query(() => TaxRate)
  async taxRate(@Args("id", { type: () => Int }) id: number): Promise<TaxRate> {
    try {
      return await this.payrollTaxService.taxRate(id);
    } catch (error) {
      throw new GraphQLException(
        "Failed to tax" + error.toString(),
        "INTERNAL_SERVER_ERROR"
      );
    }
  }
}
