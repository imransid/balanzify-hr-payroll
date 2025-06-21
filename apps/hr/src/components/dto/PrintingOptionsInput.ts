import { Field, InputType, Int, PartialType } from "@nestjs/graphql";
import { IsBoolean, IsInt, IsOptional, IsString } from "class-validator";

@InputType()
export class CreatePrintingOptionsInput {
  @Field({ nullable: true }) @IsOptional() @IsBoolean() payStubsOnly?: boolean;
  @Field({ nullable: true })
  @IsOptional()
  @IsBoolean()
  payChecksAndStubs?: boolean;
  @Field({ nullable: true }) @IsOptional() @IsString() companyId?: string;
  @Field({ nullable: true }) @IsOptional() @IsInt() profileId?: number;
}

@InputType()
export class UpdatePrintingOptionsInput extends PartialType(
  CreatePrintingOptionsInput
) {
  @Field(() => Int)
  @IsInt()
  id: number;
}
