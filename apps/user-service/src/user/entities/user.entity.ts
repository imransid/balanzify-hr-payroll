import { ObjectType, Field, Int } from '@nestjs/graphql';
import { IsEmail } from 'class-validator';
import { UserType } from '../../prisma/user-type.enum';

@ObjectType()
export class User {
  @Field((type) => Int)
  id: number;

  @Field({ nullable: true })
  firstName?: string;

  @Field({ nullable: true })
  lastName?: string;

  @Field()
  @IsEmail()
  email: string;

  @Field()
  password: string;

  @Field(() => UserType, { defaultValue: UserType.OTHER })
  userType: keyof typeof UserType;

  @Field()
  createdAt: Date;

  @Field({ nullable: true })
  updateAt?: Date;
}
