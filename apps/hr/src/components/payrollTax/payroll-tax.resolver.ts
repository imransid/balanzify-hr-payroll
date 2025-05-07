import { Resolver, Query, Mutation, Args, Int } from "@nestjs/graphql";
import { PayrollTaxService } from "./payroll-tax.service";
import { GraphQLException } from "exceptions/graphql-exception";
import { TaxRate } from "../entities/taxRate.entity";
import { FilingStatus } from "../../prisma/OnboardingType.enum";

@Resolver(() => TaxRate)
export class PayrollTaxResolver {
  constructor(private readonly payrollTaxService: PayrollTaxService) {}

  @Query(() => TaxRate)
  async taxRateCalculation(
    @Args("amount", { type: () => Int }) amount: number,
    @Args("filingStatus", { type: () => FilingStatus })
    filingStatus: FilingStatus
  ): Promise<TaxRate> {
    try {
      return await this.payrollTaxService.taxRate(amount, filingStatus);
    } catch (error) {
      throw new GraphQLException(
        "Failed to tax" + error.toString(),
        "INTERNAL_SERVER_ERROR"
      );
    }
  }

  @Query(() => TaxRate)
  async taxRateCalculationForEmployer(
    @Args("amount", { type: () => Int }) amount: number
  ): Promise<TaxRate> {
    try {
      return await this.payrollTaxService.taxRateEmployee(amount);
    } catch (error) {
      throw new GraphQLException(
        "Failed to tax" + error.toString(),
        "INTERNAL_SERVER_ERROR"
      );
    }
  }
}
