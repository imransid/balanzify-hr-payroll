import { ObjectType, Field, Int } from "@nestjs/graphql";

@ObjectType()
export class Shift {
  @Field(() => Int)
  id: number;

  @Field()
  shiftName: string;

  @Field()
  shiftCode: string;

  @Field()
  shiftDescription: string;

  @Field()
  shiftType: string;

  @Field()
  regularHour: string;

  @Field()
  shiftLate: string;

  @Field()
  shiftIn: string;

  @Field()
  shiftOut: string;

  @Field()
  lunchTime: string;

  @Field()
  lunchIn: string;

  @Field()
  lunchOut: string;

  @Field()
  tiffinTime: string;

  @Field()
  tiffinIn: string;

  @Field()
  tiffinOut: string;
}
