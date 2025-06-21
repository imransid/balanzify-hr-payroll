import { Field, InputType, Int, PartialType } from "@nestjs/graphql";
import { IsInt, IsOptional, IsString } from "class-validator";

@InputType()
export class CreateContactInfoInput {
  @Field({ nullable: true }) @IsOptional() @IsString() firstName?: string;
  @Field({ nullable: true }) @IsOptional() @IsString() lastName?: string;
  @Field({ nullable: true }) @IsOptional() @IsString() businessPhone?: string;
  @Field({ nullable: true }) @IsOptional() @IsString() emailAddress?: string;
  @Field({ nullable: true }) @IsOptional() @IsString() companyId?: string;
  @Field({ nullable: true }) @IsOptional() @IsInt() profileId?: number;
}

@InputType()
export class UpdateContactInfoInput extends PartialType(
  CreateContactInfoInput
) {
  @Field(() => Int)
  @IsInt()
  id: number;
}
