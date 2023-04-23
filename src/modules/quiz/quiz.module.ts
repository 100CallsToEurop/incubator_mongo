import { Module } from '@nestjs/common';
import { QuizController } from './api/quiz.controller';
import { CqrsModule } from '@nestjs/cqrs';
import { QuizRepository, QuizQueryRepository } from './infrastructure';
import {
  CreateQuestionUseCase,
  DeleteQuestionCommand,
  PublishQuestionCommand,
  UpdateQuestionUseCase,
} from './application/useCases';

const useCases = [
  CreateQuestionUseCase,
  DeleteQuestionCommand,
  PublishQuestionCommand,
  UpdateQuestionUseCase,
];
const adapters = [QuizRepository, QuizQueryRepository];

@Module({
  imports: [CqrsModule],
  controllers: [QuizController],
  providers: [...useCases, ...adapters],
})
export class QuizModule {}
