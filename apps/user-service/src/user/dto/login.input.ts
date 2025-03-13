import { InputType, Field } from '@nestjs/graphql';
import { IsEmail } from 'class-validator';

@InputType()
export class LoginInput {
  @Field()
  @IsEmail()
  email: string;

  @Field()
  password: string;
}

@InputType()
export class GoogleLoginInput {
  @Field()
  @IsEmail()
  email: string;

  @Field()
  provider: string;
}

@InputType()
export class UpdatePasswordDate {
  @Field()
  @IsEmail()
  email: string;

  @Field()
  date: Date;
}
@InputType()
export class GCodeData {
  @Field()
  @IsEmail()
  email: string;

  @Field()
  code: string;
}
