import { ObjectType, Field, Int } from "@nestjs/graphql";

@ObjectType()
export class Attendance {
  @Field(() => Int)
  id: number;

  @Field()
  employeeId: string;

  @Field()
  date: Date;

  @Field()
  checkIn: string;

  @Field()
  checkOut: string;

  @Field({ nullable: true })
  shift?: string;

  @Field({ nullable: true })
  worked?: string;

  @Field({ nullable: true })
  status?: string;

  @Field(() => Int, { nullable: true })
  createdBy?: number;

  @Field({ nullable: true })
  createdAt?: Date;

  @Field()
  updatedAt: Date;

  @Field({ nullable: true })
  companyID: string;
}
