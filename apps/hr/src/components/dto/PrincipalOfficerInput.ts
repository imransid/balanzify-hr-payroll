import { Field, InputType, Int, PartialType } from "@nestjs/graphql";
import { IsBoolean, IsInt, IsOptional, IsString } from "class-validator";

@InputType()
export class CreatePrincipalOfficerInput {
  @Field({ nullable: true }) @IsOptional() @IsString() ownerTitle?: string;
  @Field({ nullable: true }) @IsOptional() @IsString() ownerFirstName?: string;
  @Field({ nullable: true }) @IsOptional() @IsString() ownerLastName?: string;
  @Field({ nullable: true }) @IsOptional() @IsString() mobileNumber?: string;
  @Field({ nullable: true })
  @IsOptional()
  @IsBoolean()
  sameAsBusinessPhone?: boolean;
  @Field({ nullable: true }) @IsOptional() @IsString() ssnLast4?: string;
  @Field({ nullable: true }) @IsOptional() @IsString() dateOfBirth?: string;
  @Field({ nullable: true }) @IsOptional() @IsString() personalAddress?: string;
  @Field({ nullable: true }) @IsOptional() @IsString() personalApt?: string;
  @Field({ nullable: true }) @IsOptional() @IsString() personalZip?: string;
  @Field({ nullable: true })
  @IsOptional()
  @IsBoolean()
  sameAsBusinessAddress?: boolean;
  @Field({ nullable: true }) @IsOptional() @IsString() companyId?: string;
  @Field({ nullable: true }) @IsOptional() @IsInt() profileId?: number;
}

@InputType()
export class UpdatePrincipalOfficerInput extends PartialType(
  CreatePrincipalOfficerInput
) {
  @Field(() => Int)
  @IsInt()
  id: number;
}
