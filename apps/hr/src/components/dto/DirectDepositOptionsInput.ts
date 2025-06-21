import { Field, InputType, Int, PartialType } from "@nestjs/graphql";
import { IsBoolean, IsInt, IsOptional, IsString } from "class-validator";

@InputType()
export class CreateDirectDepositOptionsInput {
  @Field({ nullable: true }) @IsOptional() @IsBoolean() sameDay?: boolean;
  @Field({ nullable: true }) @IsOptional() @IsBoolean() fiveDay?: boolean;
  @Field({ nullable: true }) @IsOptional() @IsString() companyId?: string;
  @Field({ nullable: true }) @IsOptional() @IsInt() profileId?: number;
}

@InputType()
export class UpdateDirectDepositOptionsInput extends PartialType(
  CreateDirectDepositOptionsInput
) {
  @Field(() => Int)
  @IsInt()
  id: number;
}
