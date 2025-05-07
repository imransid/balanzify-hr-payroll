import { ObjectType, Field, Int } from "@nestjs/graphql";
import { PaySchedule } from "./paySchedule.entity";
import { Profile } from "./profile.entity";

@ObjectType()
export class EmployeePayrollProcess {
  @Field(() => Int)
  id: number;

  @Field({ nullable: true })
  employeeName?: string;

  @Field({ nullable: true })
  workingHrs?: string;

  @Field({ nullable: true })
  Rate?: string;

  @Field({ nullable: true })
  Salary?: string;

  @Field({ nullable: true })
  OT?: string;

  @Field({ nullable: true })
  doubleOT?: string;

  @Field({ nullable: true })
  PTO?: string;

  @Field({ nullable: true })
  holydayPay?: string;

  @Field({ nullable: true })
  bonus?: string;

  @Field({ nullable: true })
  commission?: string;

  @Field({ nullable: true })
  total?: string;

  @Field({ nullable: true })
  grossPay?: string;

  @Field(() => Profile, { nullable: true })
  profile?: Profile; // You can adjust this to match the relationship to the profile

  @Field(() => PaySchedule, { nullable: true })
  paySchedule?: PaySchedule; // You can adjust this to match the relationship to the pay schedule

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}
