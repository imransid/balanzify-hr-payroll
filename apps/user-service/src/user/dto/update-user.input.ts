import { IsOptional, IsAlpha, Length } from 'class-validator';
import { CreateUserInput } from './create-user.input';
import { InputType, Field, Int, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateUserInput extends PartialType(CreateUserInput) {
  @Field(() => Int)
  id: number;

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

}
