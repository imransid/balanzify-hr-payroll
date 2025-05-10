import { ObjectType, Field, Int } from "@nestjs/graphql";

@ObjectType()
export class EmployeePayroll {
  @Field(() => Int)
  id: number;

  @Field()
  employeeName: string;

  @Field()
  workingHrs: string;

  @Field()
  rate: string;

  @Field()
  salary: string;

  @Field()
  OT: string;

  @Field()
  doubleOT: string;

  @Field()
  PTO: string;

  @Field()
  holidayPay: string;

  @Field()
  bonus: string;

  @Field()
  commission: string;

  @Field()
  total: string;

  @Field()
  grossPay: string;

  @Field(() => Int)
  netPay: number;

  @Field(() => Int)
  employeeContribution: number;

  @Field(() => Int)
  employeeDeduction: number;

  @Field({ nullable: true })
  netPaySummary?: string; // Updated reference

  @Field({ nullable: true })
  createdAt?: Date;

  @Field()
  updatedAt: Date;
}
