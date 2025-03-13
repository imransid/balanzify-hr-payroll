import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { PrismaPageBuilderService } from '../../../../../prisma/prisma-page-builder.service';
import { CreateQuestionInput, UpdateQuestionInput } from '../dto/answer.input';

import {
  Answer,
  Question,
  QuestionResponse,
} from '../entities/question.entity';

@Injectable()
export class QuestionService {
  private logger = new Logger('QuestionService');

  constructor(private prisma: PrismaPageBuilderService) {}

  // Create a new question with answers
  async create(createQuestionInput: CreateQuestionInput): Promise<Question> {
    const { questionText, answers, correctAnswer } = createQuestionInput;

    try {
      // Using Prisma transaction to ensure both question and answers are created atomically
      const question = await this.prisma.$transaction(async (prisma) => {
        const createdQuestion = await prisma.question.create({
          data: {
            questionText,
            correctAnswer,
            answers: {
              create: answers.map((answerText) => ({ answerText })),
            },
          },
          include: {
            answers: true, // Include answers with the question
          },
        });
        return createdQuestion;
      });

      return question;
    } catch (error) {
      this.logger.error(
        `Error creating question: ${error.message}`,
        error.stack,
      );
      throw new HttpException(
        'Error creating question',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // Retrieve all questions with pagination
  async findAll(
    page: number = 1,
    limit: number = 10,
  ): Promise<QuestionResponse[]> {
    try {
      const skip = (page - 1) * limit;

      const questions = await this.prisma.question.findMany({
        skip,
        take: limit,
        include: { answers: true },
      });

      // Transform response to match the required format
      let qus = questions.map((question) => ({
        id: question.id,
        questionText: question.questionText,
        answers: [...question.answers.map((a) => a.answerText)],
        correctAnswer: question.correctAnswer, // You can modify this logic as needed
      }));

      console.log('qus', qus);

      return qus;
    } catch (error) {
      this.logger.error(
        `Error retrieving questions: ${error.message}`,
        error.stack,
      );
      throw new HttpException(
        'Error retrieving questions',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // Retrieve a specific question by ID with answers
  async findOne(id: number): Promise<Question> {
    try {
      const question = await this.prisma.question.findUnique({
        where: { id },
        include: { answers: true },
      });

      if (!question) {
        throw new HttpException('Question not found', HttpStatus.NOT_FOUND);
      }

      return question;
    } catch (error) {
      this.logger.error(
        `Error retrieving question with ID ${id}: ${error.message}`,
        error.stack,
      );
      throw new HttpException(
        'Error retrieving question',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async update(
    id: number,
    updateQuestionInput: UpdateQuestionInput,
  ): Promise<Question> {
    const { questionText, answers, correctAnswer } = updateQuestionInput;

    try {
      const existingData = await this.findOne(id); // Use `id`, not `updateQuestionInput.id`

      // Using Prisma transaction for atomic updates
      const updatedQuestion = await this.prisma.$transaction(async (prisma) => {
        const updateData: any = { questionText, correctAnswer };

        // If new answers are provided, delete old ones and create new ones
        if (Array.isArray(answers) && answers.length > 0) {
          updateData.answers = {
            deleteMany: {}, // Remove existing answers
            create: answers.map((answerText) => ({ answerText })), // Add new answers
          };
        } else {
          // If no new answers are provided, retain existing ones (No `deleteMany`)
          updateData.answers = {
            connect: existingData.answers.map((ans) => ({ id: ans.id })),
          };
        }

        const updated = await prisma.question.update({
          where: { id },
          data: updateData,
          include: { answers: true },
        });

        return updated;
      });

      return updatedQuestion;
    } catch (error) {
      this.logger.error(
        `Error updating question with ID ${id}: ${error.message}`,
        error.stack,
      );
      throw new HttpException(
        `Error updating question: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // Delete a question and its associated answers
  async remove(id: number): Promise<void> {
    try {
      // Use a transaction to delete the question and answers in a single atomic operation
      await this.prisma.$transaction(async (prisma) => {
        await prisma.answer.deleteMany({
          where: { questionId: id },
        });
        await prisma.question.delete({
          where: { id },
        });
      });
    } catch (error) {
      this.logger.error(
        `Error deleting question with ID ${id}: ${error.message}`,
        error.stack,
      );
      throw new HttpException(
        'Error deleting question',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // Remove a specific answer from a question
  async removeAnswer(id: number): Promise<void> {
    try {
      await this.prisma.answer.delete({
        where: { id },
      });
    } catch (error) {
      this.logger.error(
        `Error deleting answer with ID ${id}: ${error.message}`,
        error.stack,
      );
      throw new HttpException(
        'Error deleting answer',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
