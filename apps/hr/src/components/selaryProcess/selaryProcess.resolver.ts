import { Resolver, Query, Args, Int, Mutation } from "@nestjs/graphql";
import { EmployeePayrollProcess } from "../entities//employeePayroll.entity";
import { EmployeePayrollService } from "./selaryProcess.service";
import { GraphQLException } from "exceptions/graphql-exception";

import {
  CreateEmployeePayrollInput,
  UpdateEmployeePayrollInput,
  EmployeePayrollPaginatedResult,
} from "../dto/create-employee-payroll.input";
import { EmployeePayroll } from "../entities/employee-payroll.entity";
import { NotFoundException } from "@nestjs/common";

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

  @Mutation(() => EmployeePayroll)
  async createEmployeePayroll(
    @Args("createEmployeePayrollInput")
    createEmployeePayrollInput: CreateEmployeePayrollInput
  ): Promise<EmployeePayroll> {
    try {
      return await this.employeePayrollService.create(
        createEmployeePayrollInput
      );
    } catch (error) {
      throw new GraphQLException(
        "Failed to create employee payroll: " + error.toString(),
        "INTERNAL_SERVER_ERROR"
      );
    }
  }

  @Query(() => EmployeePayrollPaginatedResult)
  async employeePayrollList(
    @Args("page", { type: () => Int, nullable: true, defaultValue: 1 })
    page: number,
    @Args("limit", { type: () => Int, nullable: true, defaultValue: 10 })
    limit: number
  ): Promise<EmployeePayrollPaginatedResult> {
    try {
      return await this.employeePayrollService.findAll(page, limit);
    } catch (error) {
      throw new GraphQLException(
        "Failed to fetch employee payroll list: " + error.toString(),
        "INTERNAL_SERVER_ERROR"
      );
    }
  }

  @Query(() => EmployeePayroll)
  async employeePayroll(
    @Args("id", { type: () => Int }) id: number
  ): Promise<EmployeePayroll> {
    try {
      return await this.employeePayrollService.findOne(id);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new GraphQLException(
          `EmployeePayroll with ID ${id} not found`,
          "NOT_FOUND"
        );
      }
      throw new GraphQLException(
        "Failed to fetch employee payroll",
        "INTERNAL_SERVER_ERROR"
      );
    }
  }

  @Mutation(() => EmployeePayroll)
  async updateEmployeePayroll(
    @Args("id", { type: () => Int }) id: number,
    @Args("updateEmployeePayrollInput")
    updateEmployeePayrollInput: UpdateEmployeePayrollInput
  ): Promise<EmployeePayroll> {
    try {
      return await this.employeePayrollService.update(
        id,
        updateEmployeePayrollInput
      );
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new GraphQLException(
          `EmployeePayroll with ID ${id} not found`,
          "NOT_FOUND"
        );
      }
      throw new GraphQLException(
        "Failed to update employee payroll",
        "INTERNAL_SERVER_ERROR"
      );
    }
  }

  @Mutation(() => EmployeePayroll)
  async removeEmployeePayroll(
    @Args("id", { type: () => Int }) id: number
  ): Promise<EmployeePayroll> {
    try {
      return await this.employeePayrollService.remove(id);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new GraphQLException(
          `EmployeePayroll with ID ${id} not found`,
          "NOT_FOUND"
        );
      }
      throw new GraphQLException(
        "Failed to remove employee payroll",
        "INTERNAL_SERVER_ERROR"
      );
    }
  }

  @Query(() => EmployeePayrollPaginatedResult)
  async searchEmployeePayroll(
    @Args("query", { type: () => String }) query: string,
    @Args("page", { type: () => Int, nullable: true, defaultValue: 1 })
    page: number,
    @Args("limit", { type: () => Int, nullable: true, defaultValue: 10 })
    limit: number
  ): Promise<EmployeePayrollPaginatedResult> {
    try {
      return await this.employeePayrollService.search(query, page, limit);
    } catch (error) {
      throw new GraphQLException(
        "Failed to search employee payroll",
        "INTERNAL_SERVER_ERROR"
      );
    }
  }
}
