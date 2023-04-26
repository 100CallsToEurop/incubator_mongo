import { Module } from '@nestjs/common';
import { QuizController } from './api/quiz.controller';
import { CqrsModule } from '@nestjs/cqrs';
import { QuizRepository, QuizQueryRepository } from './infrastructure';
import {
  CreateQuestionUseCase,
  DeleteQuestionUseCase,
  PublishQuestionUseCase,
  UpdateQuestionUseCase,
} from './application/useCases';
import { MongooseModule } from '@nestjs/mongoose';
import { Questions, QuestionsSchema } from './domain/model/question.schema';

const useCases = [
  CreateQuestionUseCase,
  DeleteQuestionUseCase,
  PublishQuestionUseCase,
  UpdateQuestionUseCase,
];
const adapters = [QuizRepository, QuizQueryRepository];

@Module({
  imports: [
    CqrsModule,
    MongooseModule.forFeature([
      { name: Questions.name, schema: QuestionsSchema },
    ]),
  ],
  controllers: [QuizController],
  providers: [...useCases, ...adapters],
  exports: [...adapters],
})
export class QuizModule {}
