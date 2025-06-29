import { InputType, Field } from "@nestjs/graphql";
import { IsNotEmpty, IsOptional, IsString } from "class-validator";
import { Upload } from "scalars/upload.scalar";

@InputType()
export class CreatePunchDataInput {
  // @Field()
  // @IsNotEmpty()
  // @IsString()
  // uploadedBy: string;

  // @Field()
  // @IsNotEmpty()
  // @IsString()
  // employeeID: string;

  // @Field()
  // @IsNotEmpty()
  // @IsString()
  // companyID: string;

  @Field()
  @IsString()
  companyId: string;

  @Field(() => [Upload], {
    nullable: true,
    description: "Input for File.",
  })
  punchFile: Upload[];
}
