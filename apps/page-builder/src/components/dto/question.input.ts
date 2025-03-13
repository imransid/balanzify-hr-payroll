import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class CreateQuestionInput {
  @Field()
  questionText: string;

  @Field()
  correctAnswer: string;

  @Field(() => [String])
  answers: string[];
}
