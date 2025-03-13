import { Field, Int, ObjectType } from '@nestjs/graphql';
import { UserType } from '../../prisma/user-type.enum';

@ObjectType()
export class LoginAttempt {
  @Field()
  email: string;

  @Field()
  tryToAttemptTime: string;

  @Field()
  lockedTime: string;
}
@ObjectType()
export class Auth {
  @Field((type) => Int)
  id: number;

  @Field()
  name: string;

  @Field()
  token: string;

  @Field(() => UserType, { defaultValue: UserType.OTHER })
  userType: keyof typeof UserType;

  @Field(() => LoginAttempt, { nullable: true }) // Nullable in case no login attempts exist
  loginAttempt?: LoginAttempt;
}

@ObjectType()
export class GCode {
  @Field()
  success: boolean;

  @Field()
  message: string;
}
