import { ForbiddenException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import {
  GamePairDocument,
  GameStatuses,
  IAnswerViewModel,
} from '../domain/interface/quiz.game.interface';
import { GamePair } from '../domain/model/quiz.game.schema';
import {
  AnswerViewModel,
  GamePairViewModel,
  MyStatisticViewModel,
  TopGamePlayerViewModel,
} from '../api/models/view';
import { Paginated } from '../../../modules/paginator/models/paginator';
import {
  PaginatorInputModel,
  SortDirection,
} from '../../../modules/paginator/models/query-params.model';
import { UserPlayer } from '../domain/model/player.schema';
import { UserPlayerDocument } from '../domain/interface/player.interface';
import { TopUsersQueryDto } from '../api/models/input';

@Injectable()
export class PairQuizGamesQueryRepository {
  constructor(
    @InjectModel(UserPlayer.name)
    private readonly userPlayerModel: Model<UserPlayerDocument>,
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

  buildResponseUserPLayer(user: UserPlayerDocument): TopGamePlayerViewModel {
    return {
      sumScore: user.sumScore,
      avgScores: user.avgScores,
      gamesCount: user.gamesCount,
      winsCount: user.winsCount,
      lossesCount: user.lossesCount,
      drawsCount: user.drawsCount,
      player: {
        id: user.player.id,
        login: user.player.login,
      },
    };
  }

  async getTopUsers(
    query: TopUsersQueryDto,
  ): Promise<Paginated<TopGamePlayerViewModel[]>> {
    let sort = '';

    if (!query.sort) {
      sort = '-avgScores', '-sumScore';
    }

    if (query.sort) {
      if (Array.isArray(query.sort)) {
        for (const sortELEM of query.sort) {
          const [field, direction] = sortELEM.split(' ');
          direction === 'desc' ? sort +=`-${field} ` : sort += `${field} `;
        }
      }
      if (typeof sort === 'string') {
        const field = (query?.sort as string).split(' ')[0];
        const direction = (query.sort as string).split(' ')[1];
        direction === 'desc' ? (sort = `-${field}`) : (sort = field);
      }
    }

    //Filter
    let filter = this.gamePairModel.find();
    // filter.where({
    //   $or: [
    //     { 'firstPlayerProgress.player.id': userId },
    //     { 'secondPlayerProgress.player.id': userId },
    //   ],
    // });

    //Pagination
    const page = Number(query?.pageNumber) || 1;
    const size = Number(query?.pageSize) || 10;
    const skip: number = (page - 1) * size;
    const totalCountGames = await this.userPlayerModel.count(filter);

    const players = await this.userPlayerModel
      .find(filter)
      .skip(skip)
      .sort(sort)
      .limit(size)
      .exec();

    const paginatedGames = Paginated.getPaginated<TopGamePlayerViewModel[]>({
      items: players.map((player) => this.buildResponseUserPLayer(player)),
      page: page,
      size: size,
      count: totalCountGames,
    });

    return paginatedGames;
  }

  async getMyStatistic(userId: string): Promise<MyStatisticViewModel> {
    const myGames = await this.getFinishCountGame(userId);
    const gamesCount = myGames.length;
    const sumScore = myGames.reduce(
      (acc, game) => acc + this.score(game, userId),
      0,
    );
    const avgScores = Math.round((sumScore / gamesCount) * 100) / 100;
    const winsCount = myGames.reduce(
      (acc, game) => acc + this.win(game, userId),
      0,
    );
    const lossesCount = myGames.reduce(
      (acc, game) => acc + this.lose(game, userId),
      0,
    );
    const drawsCount = myGames.reduce(
      (acc, game) => acc + this.draw(game, userId),
      0,
    );

    return {
      sumScore,
      avgScores,
      gamesCount,
      winsCount,
      lossesCount,
      drawsCount,
    };
  }

  score(game: GamePair, userId: string): number {
    const player = game.whoPlayer(userId);
    return player.thisPlayerProgress.score;
  }

  win(game: GamePair, userId: string): number {
    const player = game.whoPlayer(userId);
    const scoreFirstPlayer = player.thisPlayerProgress.score;
    const scoreSecondPlayer = player.otherPlayerProgress.score;
    if (scoreFirstPlayer > scoreSecondPlayer) return 1;
    return 0;
  }

  lose(game: GamePair, userId: string): number {
    const player = game.whoPlayer(userId);
    const scoreFirstPlayer = player.thisPlayerProgress.score;
    const scoreSecondPlayer = player.otherPlayerProgress.score;
    if (scoreFirstPlayer < scoreSecondPlayer) return 1;
    return 0;
  }

  draw(game: GamePair, userId: string): number {
    const player = game.whoPlayer(userId);
    const scoreFirstPlayer = player.thisPlayerProgress.score;
    const scoreSecondPlayer = player.otherPlayerProgress.score;
    if (scoreFirstPlayer === scoreSecondPlayer) return 1;
    return 0;
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

  async getUserPlayer(playerId: string): Promise<UserPlayerDocument> {
    return await this.userPlayerModel
      .findOne({ 'player.id': playerId })
      .exec();
  }

  async getFinishCountGame(userId: string): Promise<Array<GamePairDocument>> {
    const gamePair = await this.gamePairModel.find().where({
      $and: [
        {
          $or: [
            { 'firstPlayerProgress.player.id': userId },
            { 'secondPlayerProgress.player.id': userId },
          ],
        },
        {
          status: GameStatuses.FINISHED,
        },
      ],
    });
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
