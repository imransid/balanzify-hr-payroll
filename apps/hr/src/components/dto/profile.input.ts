import {
  Int,
  PartialType,
  InputType,
  Field,
  ObjectType,
} from "@nestjs/graphql";
import {
  IsNotEmpty,
  IsString,
  IsDate,
  IsBoolean,
  IsInt,
  IsOptional,
} from "class-validator";
import { Profile } from "../entities/profile.entity";
import { OnboardingType } from "../../prisma/OnboardingType.enum";

@InputType()
export class CreateProfileInput {
  @Field()
  @IsNotEmpty()
  @IsString()
  companyName: string;

  @Field()
  @IsNotEmpty()
  @IsString()
  email: string;

  @Field()
  @IsNotEmpty()
  @IsString()
  employeeName: string;

  @Field()
  @IsNotEmpty()
  @IsString()
  middleName: string;

  @Field()
  @IsNotEmpty()
  @IsString()
  lastName: string;

  @Field()
  @IsNotEmpty()
  @IsDate()
  hireDate: Date;

  @Field()
  @IsNotEmpty()
  @IsString()
  designation: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  department?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  companyID?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  employeeType?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  mobilePhone?: string;

  @Field()
  @IsNotEmpty()
  @IsBoolean()
  status: boolean;

  @Field(() => OnboardingType, {
    defaultValue: OnboardingType.EMPLOYEE_SELF_ONBOARD,
  }) // Change to use the enum
  @IsNotEmpty()
  onboardingType: keyof typeof OnboardingType;
}

@InputType()
export class UpdateProfileInput extends PartialType(CreateProfileInput) {
  @Field(() => Int)
  @IsNotEmpty()
  @IsInt()
  id: number;
}

@ObjectType()
export class ProfilePaginatedResult {
  @Field(() => [Profile], { defaultValue: [] })
  profiles: Profile[] = [];

  @Field(() => Int)
  totalPages: number;

  @Field(() => Int)
  currentPage: number;

  @Field(() => Int)
  totalCount: number;

  constructor(
    profiles: Profile[],
    totalPages: number,
    currentPage: number,
    totalCount: number
  ) {
    this.profiles = profiles ?? [];
    this.totalPages = totalPages;
    this.currentPage = currentPage;
    this.totalCount = totalCount;
  }
}
