import { InputType,Field } from '@nestjs/graphql';
import { IsAlpha, IsEmail, IsOptional, Length, Matches, MaxLength, MinLength } from 'class-validator';
import { UserType } from '../../prisma/user-type.enum';

@InputType()
export class CreateUserInput {

  @Field()
  @IsOptional()
  @IsAlpha()
  @Length(0, 255)
  firstName?: string;

  @Field()
  @IsOptional()
  @IsAlpha()
  @Length(0, 255)
  lastName?: string;

  @Field()
  @IsEmail()
  email: string;

  @Field()
  @MinLength(8)
  @MaxLength(32)
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {message: 'password too weak'})
  password: string;


  @Field(() => UserType,{ defaultValue: UserType.OTHER })
  userType: keyof typeof UserType;
}