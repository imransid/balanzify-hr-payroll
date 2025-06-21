import { Field, InputType, Int, PartialType } from "@nestjs/graphql";
import { IsInt, IsOptional, IsString } from "class-validator";

@InputType()
export class CreateBusinessBankAccountInput {
  @Field({ nullable: true }) @IsOptional() @IsString() legalName?: string;
  @Field({ nullable: true }) @IsOptional() @IsString() businessEmail?: string;
  @Field({ nullable: true }) @IsOptional() @IsString() website?: string;
  @Field({ nullable: true }) @IsOptional() @IsString() industry?: string;
  @Field({ nullable: true }) @IsOptional() @IsString() businessType?: string;
  @Field({ nullable: true }) @IsOptional() @IsString() businessPhone?: string;
  @Field({ nullable: true }) @IsOptional() @IsString() businessAddress?: string;
  @Field({ nullable: true }) @IsOptional() @IsString() businessApt?: string;
  @Field({ nullable: true }) @IsOptional() @IsString() businessZip?: string;
  @Field({ nullable: true }) @IsOptional() @IsString() businessCity?: string;
  @Field({ nullable: true }) @IsOptional() @IsString() businessState?: string;
  @Field({ nullable: true }) @IsOptional() @IsString() companyId?: string;
  @Field({ nullable: true }) @IsOptional() @IsInt() profileId?: number;
}

@InputType()
export class UpdateBusinessBankAccountInput extends PartialType(
  CreateBusinessBankAccountInput
) {
  @Field(() => Int)
  @IsInt()
  id: number;
}
