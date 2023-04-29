import {
  Body,
  Controller,
  Get,
  HttpCode,
  NotFoundException,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { AnswerViewModel, GamePairViewModel } from './models/view';
import { AnswerInputModel } from './models/input';
import { PairQuizGamesQueryRepository } from '../infrastructure';
import {
  QuizGameAnswersCommand,
  QuizGameConnectionCommand,
} from '../application/useCases';
import { GetCurrentUserId } from '../../../common/decorators/get-current-user-id.decorator';
import { ParseObjectIdPipe } from 'src/common/pipe/validation.objectid.pipe';

@Controller('pair-game-quiz/pairs')
export class PairQuizGameController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly pairQuizGamesQueryRepository: PairQuizGamesQueryRepository,
  ) {}

  @HttpCode(200)
  @Get('my-current')
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
  @Get(':id')
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
  @Post('connection')
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
  @Post('my-current/answers')
  async myCurrentAnswers(
    @Body() answer: AnswerInputModel,
    @GetCurrentUserId() userId: string,
  ): Promise<AnswerViewModel> {
    const result = await this.commandBus.execute(
      new QuizGameAnswersCommand(answer, userId),
    );
    return await this.pairQuizGamesQueryRepository.buildResponseAnswer(result);
  }
}
