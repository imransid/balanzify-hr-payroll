import { Field, InputType, Int, PartialType } from "@nestjs/graphql";
import { IsBoolean, IsInt, IsOptional, IsString } from "class-validator";

@InputType()
export class CreateEmployeeProfilePermissionsInput {
  @Field({ nullable: true })
  @IsOptional()
  @IsBoolean()
  personalInfo?: boolean;

  @Field({ nullable: true })
  @IsOptional()
  @IsBoolean()
  taxWithholdings?: boolean;

  @Field({ nullable: true })
  @IsOptional()
  @IsBoolean()
  directDepositEdit?: boolean;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  companyId?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsInt()
  profileId?: number;
}

@InputType()
export class UpdateEmployeeProfilePermissionsInput extends PartialType(
  CreateEmployeeProfilePermissionsInput
) {
  @Field(() => Int)
  @IsInt()
  id: number;
}
