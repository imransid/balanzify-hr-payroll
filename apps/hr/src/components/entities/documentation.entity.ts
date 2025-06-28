import { ObjectType, Field, Int } from "@nestjs/graphql";
import { ProfileDetails } from "./profileDetails.entity"; // adjust path if needed

@ObjectType()
export class Documentation {
  @Field(() => Int)
  id: number;

  @Field()
  documentationName: string;

  @Field()
  documentationSize: string;

  @Field()
  lastUpdate: string;

  @Field()
  uploadedBy: string;

  @Field()
  companyId: string;

  @Field()
  documentationURL: string;

  @Field(() => Int, { nullable: true })
  createdBy?: number;

  @Field({ nullable: true })
  createdAt?: Date;

  @Field()
  updatedAt: Date;
}
