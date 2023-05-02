import {
  Body,
  Controller,
  Get,
  HttpCode,
  NotFoundException,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import {
  AnswerViewModel,
  GamePairViewModel,
  MyStatisticViewModel,
  TopGamePlayerViewModel,
} from './models/view';
import { AnswerInputModel, TopUsersQueryDto } from './models/input';
import { PairQuizGamesQueryRepository } from '../infrastructure';
import {
  QuizGameAnswersCommand,
  QuizGameConnectionCommand,
} from '../application/useCases';
import { GetCurrentUserId } from '../../../common/decorators/get-current-user-id.decorator';
import { ParseObjectIdPipe } from 'src/common/pipe/validation.objectid.pipe';
import { Paginated } from '../../../modules/paginator/models/paginator';
import { PaginatorInputModel } from '../../../modules/paginator/models/query-params.model';
import { Public } from 'src/common/decorators/public.decorator';
import { CheckGameActiveCommand } from '../application/useCases/check.game.active.use-case';
import { Cron, CronExpression } from '@nestjs/schedule';

@Controller()
export class PairQuizGameController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly pairQuizGamesQueryRepository: PairQuizGamesQueryRepository,
  ) {}

  @Public()
  @HttpCode(200)
  @Get('pair-game-quiz/users/top')
  async getTopUsers(
    @Query() query?: TopUsersQueryDto,
  ): Promise<Paginated<TopGamePlayerViewModel[]>> {
    return await this.pairQuizGamesQueryRepository.getTopUsers(query);
  }

  @HttpCode(200)
  @Get('pair-game-quiz/users/my-statistic')
  async getMyStatistic(
    @GetCurrentUserId() userId: string,
  ): Promise<MyStatisticViewModel> {
    return await this.pairQuizGamesQueryRepository.getMyStatistic(userId);
  }

  @HttpCode(200)
  @Get('pair-game-quiz/pairs/my')
  async getMyGames(
    @GetCurrentUserId() userId: string,
    @Query() query?: PaginatorInputModel,
  ): Promise<Paginated<GamePairViewModel[]>> {
    return await this.pairQuizGamesQueryRepository.getMyGames(userId, query);
  }

  @HttpCode(200)
  @Get('pair-game-quiz/pairs/my-current')
  async getMyCurrentGame(
    @GetCurrentUserId() userId: string,
  ): Promise<GamePairViewModel> {
    const game = await this.pairQuizGamesQueryRepository.getCurrentGamePair(
      userId,
    );
    if (!game) {
      throw new NotFoundException();
    }
    return await this.pairQuizGamesQueryRepository.buildResponseGame(game);
  }

  @HttpCode(200)
  @Get('pair-game-quiz/pairs/:id')
  async getGameById(
    @Param('id', ParseObjectIdPipe) id: string,
    @GetCurrentUserId() userId: string,
  ): Promise<GamePairViewModel> {
    const game = await this.pairQuizGamesQueryRepository.getGamePairById(
      id,
      userId,
    );
    if (!game) {
      throw new NotFoundException();
    }
    return await this.pairQuizGamesQueryRepository.buildResponseGame(game);
  }

  @HttpCode(200)
  @Post('pair-game-quiz/pairs/connection')
  async createConnection(
    @GetCurrentUserId() userId: string,
  ): Promise<GamePairViewModel> {
    const gameId = await this.commandBus.execute(
      new QuizGameConnectionCommand(userId),
    );
    const game = await this.pairQuizGamesQueryRepository.getGamePairById(
      gameId,
      userId,
    );
    return await this.pairQuizGamesQueryRepository.buildResponseGame(game);
  }

  @HttpCode(200)
  @Post('pair-game-quiz/pairs/my-current/answers')
  async myCurrentAnswers(
    @Body() answer: AnswerInputModel,
    @GetCurrentUserId() userId: string,
  ): Promise<AnswerViewModel> {
    const result = await this.commandBus.execute(
      new QuizGameAnswersCommand(answer, userId),
    );
    return await this.pairQuizGamesQueryRepository.buildResponseAnswer(result);
  }

  @Cron('4 * * * * *')
  async checkActiveGame(): Promise<void> {
    await this.commandBus.execute(new CheckGameActiveCommand());
  }
}
