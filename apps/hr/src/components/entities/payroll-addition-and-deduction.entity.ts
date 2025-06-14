import { ObjectType, Field, Int } from "@nestjs/graphql";

@ObjectType()
export class PayrollAdditionAndDeduction {
  @Field(() => Int)
  id: number;

  @Field({ nullable: true })
  uid?: string;

  @Field({ nullable: true })
  companyId?: string;

  @Field({ nullable: true })
  kind?: string;

  @Field({ nullable: true })
  amount?: string;

  @Field({ nullable: true })
  inputDate?: Date;

  @Field({ nullable: true })
  joinDate?: Date;

  @Field({ nullable: true })
  designation?: string;

  @Field({ nullable: true })
  department?: string;

  @Field({ nullable: true })
  remark?: string;

  @Field({ nullable: true })
  employee?: string;

  @Field({ nullable: true })
  createdAt?: Date;

  @Field({ nullable: true })
  updatedAt?: Date;
}
