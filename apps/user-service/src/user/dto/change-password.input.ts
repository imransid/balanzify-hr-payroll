import { InputType,Field} from '@nestjs/graphql';
import { IsEmail, Matches, MaxLength, MinLength } from 'class-validator';

@InputType()
export class ChangePasswordInput {
  @Field()
  @IsEmail()
  email: string;

  @Field()
  @MinLength(8)
  @MaxLength(32)
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {message: 'password too weak'})
  password: string;

  @Field()
  rememberToken: string

}
