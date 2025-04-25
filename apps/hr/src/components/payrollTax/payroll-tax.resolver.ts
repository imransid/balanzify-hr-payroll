import { Resolver, Query, Mutation, Args, Int } from "@nestjs/graphql";
import { PayrollTaxService } from "./payroll-tax.service";

import { LeaveType } from "../entities/leaveType.entity";
import { GraphQLException } from "exceptions/graphql-exception";

@Resolver(() => LeaveType)
export class PayrollTaxResolver {
  constructor(private readonly payrollTaxService: PayrollTaxService) {}

  @Mutation(() => LeaveType)
  async createLeaveType(@Args("createLeaveTypeInput") c): Promise<any> {
    try {
      //   return await this.payrollTaxService.create(createLeaveTypeInput);
    } catch (error) {
      throw new GraphQLException(
        "Failed to create leave type",
        "INTERNAL_SERVER_ERROR"
      );
    }
  }
}
