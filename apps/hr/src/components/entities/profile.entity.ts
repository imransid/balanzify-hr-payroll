import { ObjectType, Field, Int } from "@nestjs/graphql";
import { OnboardingType } from "../../prisma/OnboardingType.enum";
import { ProfileDetails } from "./profileDetails.entity";
import { TimeSheetProcess } from "./timeSheetProcess.entity";
import { TimeSheet } from "./timesheet.entity";

@ObjectType()
export class Profile {
  @Field(() => Int)
  id: number;

  @Field()
  employeeName: string;

  @Field()
  email: string;

  @Field()
  middleName: string;

  @Field()
  lastName: string;

  @Field()
  hireDate: Date;

  @Field()
  designation: string;

  @Field({ nullable: true })
  department?: string;

  @Field({ nullable: true })
  companyID?: string;

  @Field({ nullable: true })
  employeeType?: string;

  @Field({ nullable: true })
  mobilePhone?: string;

  @Field({ nullable: true })
  employeeID?: string;

  @Field()
  status: boolean;

  @Field(() => OnboardingType, {
    defaultValue: OnboardingType.EMPLOYEE_SELF_ONBOARD,
  })
  onboardingType: keyof typeof OnboardingType;

  @Field({ nullable: true })
  profileDetails?: ProfileDetails;

  @Field({ nullable: true })
  timeSheetProcesses?: TimeSheetProcess;

  @Field(() => [TimeSheet], { nullable: true })
  timeSheet?: TimeSheet[];
}
