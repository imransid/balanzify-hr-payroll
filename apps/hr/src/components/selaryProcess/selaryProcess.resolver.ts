import { Resolver, Query, Args, Int } from "@nestjs/graphql";
import { EmployeePayrollProcess } from "../entities//employeePayroll.entity";
import { EmployeePayrollService } from "./selaryProcess.service";
import { GraphQLException } from "exceptions/graphql-exception";

@Resolver(() => EmployeePayrollProcess)
export class EmployeePayrollProcessResolver {
  constructor(
    private readonly employeePayrollService: EmployeePayrollService
  ) {}

  @Query(() => [EmployeePayrollProcess])
  async allProcessSalaryList(
    @Args("payScheduleId", { type: () => Int }) payScheduleId: number
  ): Promise<EmployeePayrollProcess[]> {
    try {
      return await this.employeePayrollService.getAllEmployeePayroll(
        payScheduleId
      );
    } catch (error) {
      throw new GraphQLException(
        "Failed to retrieve payroll list" + error.toString(),
        "INTERNAL_SERVER_ERROR"
      );
    }
  }
}
