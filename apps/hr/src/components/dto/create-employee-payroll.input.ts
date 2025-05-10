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
class EmployeeDtaInput {
  @Field(() => Int)
  @IsNotEmpty()
  @IsInt()
  federalTaxWithHoldingYearly: number;

  @Field(() => Int)
  @IsNotEmpty()
  @IsInt()
  medicareTax: number;

  @Field(() => Int)
  @IsNotEmpty()
  @IsInt()
  socialSecurityTax: number;

  @Field(() => Int)
  @IsNotEmpty()
  @IsInt()
  taxableIncome: number;

  @Field(() => Int)
  @IsNotEmpty()
  @IsInt()
  federalTaxWithHoldingMonthlyRate: number;

  @Field(() => Int)
  @IsNotEmpty()
  @IsInt()
  federalTaxWithHoldingWeeklyRate: number;
}

@InputType()
class EmployerDtaInput {
  @Field(() => Int)
  @IsNotEmpty()
  @IsInt()
  medicareTax: number;

  @Field(() => Int)
  @IsNotEmpty()
  @IsInt()
  socialSecurityTax: number;

  @Field(() => Int)
  @IsNotEmpty()
  @IsInt()
  additionalMedicareTax: number;

  @Field(() => Int)
  @IsNotEmpty()
  @IsInt()
  futaTax: number;
}

@InputType()
class NetPaySummaryInput {
  @Field(() => EmployeeDtaInput)
  @IsNotEmpty()
  employeeDta: EmployeeDtaInput;

  @Field(() => EmployerDtaInput)
  @IsNotEmpty()
  employerDta: EmployerDtaInput;
}

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
  profileId?: number;

  @Field(() => Int)
  @IsOptional()
  @IsInt()
  employeeContribution?: number;

  @Field(() => Int)
  @IsOptional()
  @IsInt()
  employeeDeduction?: number;

  @Field(() => NetPaySummaryInput, { nullable: true })
  @IsOptional()
  netPaySummary?: NetPaySummaryInput;
}

@InputType()
export class UpdateEmployeePayrollInput extends PartialType(
  CreateEmployeePayrollInput
) {
  @Field(() => Int)
  @IsNotEmpty()
  @IsInt()
  id: number;

  @Field(() => Int)
  @IsOptional()
  @IsInt()
  profileId?: number | null;
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
