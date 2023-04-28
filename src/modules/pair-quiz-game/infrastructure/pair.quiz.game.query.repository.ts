import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import {
  GamePairDocument,
  GameStatuses,
} from '../domain/interface/quiz.game.interface';
import { GamePair } from '../domain/model/quiz.game.schema';
import { AnswerViewModel, GamePairViewModel } from '../api/models/view';

@Injectable()
export class PairQuizGamesQueryRepository {
  constructor(
    @InjectModel(GamePair.name)
    private readonly gamePairModel: Model<GamePairDocument>,
  ) {}

  buildResponseGame(game: GamePairDocument): GamePairViewModel {
    const gameStatus = game.status === GameStatuses.PENDING_SECOND_PLAYER;
    return {
      id: game._id.toString(),
      firstPlayerProgress: game.firstPlayerProgress,
      secondPlayerProgress: gameStatus ? null : game.secondPlayerProgress,
      questions: gameStatus ? null : game.questions,
      status: game.status,
      pairCreatedDate: game.pairCreatedDate.toISOString(),
      startGameDate: gameStatus ? null : game.startGameDate.toISOString(),
      finishGameDate: gameStatus ? null : game.finishGameDate.toISOString(),
    };
  }

  buildResponseAnswer(answer: any): AnswerViewModel {
    return {
      questionId: answer._id.toString(),
      answerStatus: answer.answerStatus,
      addedAt: answer.addedAt,
    };
  }

  async getGamePairById(
    gamePairId: string,
    userId: string,
  ): Promise<GamePairDocument> {
    const gamePair = await this.gamePairModel
      .findOne({ _id: new Types.ObjectId(gamePairId) })
      .or([
        { 'firstPlayerProgress.player.id': userId },
        { 'secondPlayerProgress.player.id': userId },
      ])
      .exec();
    return gamePair;
  }

  async getCurrentGamePair(userId: string): Promise<GamePairDocument> {
    const gamePair = await this.gamePairModel
      .findOne()
      .or([
        { 'firstPlayerProgress.player.id': userId },
        { 'secondPlayerProgress.player.id': userId },
      ])
      .and([
        { status: GameStatuses.ACTIVE },
        { status: GameStatuses.PENDING_SECOND_PLAYER },
      ])
      .exec();
    return gamePair;
  }

  async checkGamePair(): Promise<GamePairDocument> {
    const gamePair = await this.gamePairModel
      .findOne({ status: GameStatuses.ACTIVE })
      .exec();
    return gamePair;
  }
}
