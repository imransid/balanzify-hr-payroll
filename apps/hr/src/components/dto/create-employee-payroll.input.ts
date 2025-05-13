import {
  InputType,
  Field,
  Int,
  Float,
  PartialType,
  ObjectType,
} from "@nestjs/graphql";
import {
  IsNotEmpty,
  IsString,
  IsOptional,
  IsInt,
  IsNumber,
} from "class-validator";
import { EmployeePayroll } from "../entities/employee-payroll.entity";

@InputType()
export class CreateEmployeePayrollInput {
  @Field()
  @IsNotEmpty()
  @IsString()
  employeeName: string;

  @Field()
  @IsNotEmpty()
  @IsString()
  workingHrs: string;

  @Field()
  @IsNotEmpty()
  @IsString()
  rate: string;

  @Field()
  @IsNotEmpty()
  @IsString()
  salary: string;

  @Field()
  @IsNotEmpty()
  @IsString()
  OT: string;

  @Field()
  @IsNotEmpty()
  @IsString()
  doubleOT: string;

  @Field()
  @IsNotEmpty()
  @IsString()
  PTO: string;

  @Field()
  @IsNotEmpty()
  @IsString()
  holidayPay: string;

  @Field()
  @IsNotEmpty()
  @IsString()
  bonus: string;

  @Field()
  @IsNotEmpty()
  @IsString()
  commission: string;

  @Field()
  @IsNotEmpty()
  @IsString()
  total: string;

  @Field()
  @IsNotEmpty()
  @IsString()
  grossPay: string;

  @Field(() => Int)
  @IsOptional()
  @IsInt()
  netPay?: number;

  @Field(() => Int)
  @IsOptional()
  @IsInt()
  employeeContribution?: number;

  @Field(() => Int)
  @IsOptional()
  @IsInt()
  employeeDeduction?: number;

  @Field(() => Int)
  @IsOptional()
  @IsInt()
  profileId?: number;

  @Field()
  @IsOptional()
  @IsString()
  companyID?: string;

  @Field({ nullable: true })
  @IsOptional()
  netPaySummary?: string;
}

@InputType()
export class UpdateEmployeePayrollInput extends PartialType(
  CreateEmployeePayrollInput
) {
  @Field(() => Int)
  @IsNotEmpty()
  @IsInt()
  id: number;
}

@ObjectType()
export class EmployeePayrollPaginatedResult {
  @Field(() => [EmployeePayroll], { defaultValue: [] })
  payrolls: EmployeePayroll[] = [];

  @Field(() => Int)
  totalPages: number;

  @Field(() => Int)
  currentPage: number;

  @Field(() => Int)
  totalCount: number;

  constructor(
    payrolls: EmployeePayroll[],
    totalPages: number,
    currentPage: number,
    totalCount: number
  ) {
    this.payrolls = payrolls ?? [];
    this.totalPages = totalPages;
    this.currentPage = currentPage;
    this.totalCount = totalCount;
  }
}
