import { Module } from '@nestjs/common';
import { PairQuizGameController } from './api/pair-quiz-game.controller';
import { CqrsModule } from '@nestjs/cqrs';
import {
  PairQuizGamesQueryRepository,
  PairQuizGamesRepository,
} from './infrastructure';
import { MongooseModule } from '@nestjs/mongoose';
import { GamePair, GamePairSchema } from './domain/model/quiz.game.schema';
import { QuizGameConnectionUseCase, QuizGameAnswersUseCase } from './application/useCases';
import { UsersModule } from '../users/users.module';
import { QuizModule } from '../quiz/quiz.module';

const useCases = [QuizGameConnectionUseCase, QuizGameAnswersUseCase];
const adapters = [PairQuizGamesRepository, PairQuizGamesQueryRepository];

@Module({
  imports: [
    CqrsModule,
    UsersModule,
    QuizModule,
    MongooseModule.forFeature([
      { name: GamePair.name, schema: GamePairSchema },
    ]),
  ],
  controllers: [PairQuizGameController],
  providers: [...useCases, ...adapters],
})
export class PairQuizGameModule {}
