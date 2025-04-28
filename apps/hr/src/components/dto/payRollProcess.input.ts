import { Field, InputType } from "@nestjs/graphql";
import { IsNotEmpty, IsString } from "class-validator";

@InputType()
export class TaxAmount {
  @Field()
  @IsNotEmpty()
  @IsString()
  amount: number;
}
