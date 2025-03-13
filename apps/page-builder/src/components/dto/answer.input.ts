import { Int, PartialType, InputType, Field } from '@nestjs/graphql';
import {
  IsNotEmpty,
  IsString,
  ArrayNotEmpty,
  IsArray,
  IsOptional,
} from 'class-validator';

@InputType()
export class CreateQuestionInput {
  @Field()
  @IsNotEmpty()
  @IsString()
  questionText: string;

  @IsNotEmpty()
  @IsString()
  correctAnswer: string;

  @Field(() => [String])
  @IsArray()
  @ArrayNotEmpty()
  answers: string[];
}

@InputType()
export class UpdateQuestionInput extends PartialType(CreateQuestionInput) {
  @Field(() => Int)
  @IsNotEmpty()
  id: number;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  questionText?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  correctAnswer?: string;

  @Field(() => [String], { nullable: true })
  @IsOptional()
  @IsArray()
  @ArrayNotEmpty()
  answers?: string[];
}
