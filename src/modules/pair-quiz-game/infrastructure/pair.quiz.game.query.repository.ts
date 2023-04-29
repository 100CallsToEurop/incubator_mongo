import { ForbiddenException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import {
  GamePairDocument,
  GameStatuses,
  IAnswerViewModel,
} from '../domain/interface/quiz.game.interface';
import { GamePair } from '../domain/model/quiz.game.schema';
import { AnswerViewModel, GamePairViewModel } from '../api/models/view';
import { Paginated } from '../../../modules/paginator/models/paginator';
import {
  PaginatorInputModel,
  SortDirection,
} from '../../../modules/paginator/models/query-params.model';

@Injectable()
export class PairQuizGamesQueryRepository {
  constructor(
    @InjectModel(GamePair.name)
    private readonly gamePairModel: Model<GamePairDocument>,
  ) {}

  buildResponseGame(game: GamePairDocument): GamePairViewModel {
    const gameStatus = game.status === GameStatuses.PENDING_SECOND_PLAYER;
    const gameFinishStatus = game.status === GameStatuses.FINISHED;
    return {
      id: game._id.toString(),
      firstPlayerProgress: {
        answers: game.firstPlayerProgress.answers.map((answer) => {
          return {
            questionId: answer.questionId,
            answerStatus: answer.answerStatus,
            addedAt: answer ? answer.addedAt.toISOString() : '',
          };
        }),
        player: {
          id: game.firstPlayerProgress.player.id,
          login: game.firstPlayerProgress.player.login,
        },
        score: game.firstPlayerProgress.score,
      },
      secondPlayerProgress: gameStatus
        ? null
        : {
            answers: game.secondPlayerProgress.answers.map((answer) => {
              return {
                questionId: answer.questionId,
                answerStatus: answer.answerStatus,
                addedAt: answer ? answer.addedAt.toISOString() : '',
              };
            }),
            player: {
              id: game.secondPlayerProgress.player.id,
              login: game.secondPlayerProgress.player.login,
            },
            score: game.secondPlayerProgress.score,
          },
      questions: gameStatus
        ? null
        : game.questions.map((question) => {
            return { id: question.id, body: question.body };
          }),
      status: game.status,
      pairCreatedDate: game.pairCreatedDate.toISOString(),
      startGameDate: gameStatus ? null : game.startGameDate.toISOString(),
      finishGameDate: gameFinishStatus
        ? game.finishGameDate.toISOString()
        : null,
    };
  }

  buildResponseAnswer(answer: IAnswerViewModel): AnswerViewModel {
    return {
      questionId: answer.questionId,
      answerStatus: answer.answerStatus,
      addedAt: answer.addedAt.toISOString(),
    };
  }

  async getGamePairById(
    gamePairId: string,
    userId: string,
  ): Promise<GamePairDocument> {
    const gamePair = await this.gamePairModel
      .findOne({ _id: new Types.ObjectId(gamePairId) })
      .exec();
    if (!gamePair) return null;
    if (!gamePair.checkUser(userId)) {
      throw new ForbiddenException();
    }
    return gamePair;
  }

  async getCurrentGamePair(userId: string): Promise<GamePairDocument> {
    const gamePair = await this.gamePairModel
      .findOne()
      .where({
        $and: [
          {
            $or: [
              { 'firstPlayerProgress.player.id': userId },
              { 'secondPlayerProgress.player.id': userId },
            ],
          },
          {
            $or: [
              { status: GameStatuses.ACTIVE },
              { status: GameStatuses.PENDING_SECOND_PLAYER },
            ],
          },
        ],
      })
      .exec();
    return gamePair;
  }

  async checkGamePair(): Promise<GamePairDocument> {
    const gamePair = await this.gamePairModel
      .findOne({ status: GameStatuses.PENDING_SECOND_PLAYER })
      .exec();
    return gamePair;
  }

  async getMyGames(
    userId: string,
    query?: PaginatorInputModel,
  ): Promise<Paginated<GamePairViewModel[]>> {
    const sortDefault = 'pairCreatedDate';
    let sort = `-${sortDefault}`;

    if (query?.sortBy && query?.sortDirection) {
      query.sortDirection === SortDirection.DESC
        ? (sort = `-${query.sortBy}, -pairCreatedDate`)
        : (sort = `${query.sortBy}, -pairCreatedDate`);
    } else if (query?.sortDirection) {
      query.sortDirection === SortDirection.DESC
        ? (sort = `-${sortDefault}`)
        : (sort = sortDefault);
    } else if (query?.sortBy) {
      sort = `-${query.sortBy}, -pairCreatedDate`;
    }

    //Filter
    let filter = this.gamePairModel.find();
    filter.where({
      $or: [
        { 'firstPlayerProgress.player.id': userId },
        { 'secondPlayerProgress.player.id': userId },
      ],
    });

    //Pagination
    const page = Number(query?.pageNumber) || 1;
    const size = Number(query?.pageSize) || 10;
    const skip: number = (page - 1) * size;
    const totalCountGames = await this.gamePairModel.count(filter);

    const games = await this.gamePairModel
      .find(filter)
      .skip(skip)
      .sort(sort)
      .limit(size)
      .exec();

    const paginatedGames = Paginated.getPaginated<GamePairViewModel[]>({
      items: games.map((game) => this.buildResponseGame(game)),
      page: page,
      size: size,
      count: totalCountGames,
    });

    return paginatedGames;
  }
}
