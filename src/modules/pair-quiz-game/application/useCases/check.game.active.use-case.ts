import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import {
  PairQuizGamesQueryRepository,
  PairQuizGamesRepository,
} from '../../infrastructure';
import {
  AnswerStatuses,
  GameStatuses,
} from '../../domain/interface/quiz.game.interface';
import {
  UserPlayerDocument,
  UserPlayerModelType,
} from '../../domain/interface/player.interface';
import { GamePair } from '../../domain/model/quiz.game.schema';
import { UserPlayerEntity } from '../../domain/entity/player.entity';
import { InjectModel } from '@nestjs/mongoose';
import { UserPlayer } from '../../domain/model/player.schema';

export class CheckGameActiveCommand {
  constructor() {}
}

@CommandHandler(CheckGameActiveCommand)
export class CheckGameActiveUseCase
  implements ICommandHandler<CheckGameActiveCommand>
{
  constructor(
    @InjectModel(UserPlayer.name)
    private readonly UserPlayerModel: UserPlayerModelType,
    private readonly pairQuizGamesRepository: PairQuizGamesRepository,
    private readonly pairQuizGamesQueryRepository: PairQuizGamesQueryRepository,
  ) {}
  async execute(command: CheckGameActiveCommand): Promise<void> {
    const findActiveGames =
      await this.pairQuizGamesQueryRepository.getActiveGame();

    for (const game of findActiveGames) {
      if (!this.whatTime(game.secondPlayerProgress.endGame)) {
        const currentUserAnswersCount = game.firstPlayerProgress.answers.length;
        const currentGameQuestionCount = game.questions.length;
        console.log(currentUserAnswersCount + ' ' + currentGameQuestionCount);
        for (
          let i = currentUserAnswersCount;
          i < currentGameQuestionCount;
          i++
        ) {
          game.giveAnAnswer(
            game.questions[i].id,
            AnswerStatuses.INCORRECT,
            game.firstPlayerProgress.player.id,
          );
        }
        game.endGame();
        await this.pairQuizGamesRepository.save(game);

        if (game.status === GameStatuses.FINISHED) {
          const thisPlayerProgress = game.firstPlayerProgress;
          const otherPlayerProgress = game.secondPlayerProgress;

          let thisUserPlayer =
            await this.pairQuizGamesQueryRepository.getUserPlayer(
              thisPlayerProgress.player.id,
            );

          if (!thisUserPlayer) {
            const newUserPlayerEntity = new UserPlayerEntity(
              thisPlayerProgress.player.id,
              thisPlayerProgress.player.login,
            );
            thisUserPlayer = this.UserPlayerModel.createUserPlayer(
              newUserPlayerEntity,
              this.UserPlayerModel,
            );
          }
          let otherUserPlayer =
            await this.pairQuizGamesQueryRepository.getUserPlayer(
              otherPlayerProgress.player.id,
            );

          if (!otherUserPlayer) {
            const newUserPlayerEntity = new UserPlayerEntity(
              otherPlayerProgress.player.id,
              otherPlayerProgress.player.login,
            );
            otherUserPlayer = this.UserPlayerModel.createUserPlayer(
              newUserPlayerEntity,
              this.UserPlayerModel,
            );
          }

          await this.updateStatistic(thisUserPlayer, game);
          await this.updateStatistic(otherUserPlayer, game);
        }
      }

      if (!this.whatTime(game.firstPlayerProgress.endGame)) {
        const currentUserAnswersCount =
          game.secondPlayerProgress.answers.length;
        const currentGameQuestionCount = game.questions.length;
        console.log(currentUserAnswersCount + ' ' + currentGameQuestionCount);
        for (
          let i = currentUserAnswersCount;
          i < currentGameQuestionCount;
          i++
        ) {
          game.giveAnAnswer(
            game.questions[i].id,
            AnswerStatuses.INCORRECT,
            game.secondPlayerProgress.player.id,
          );
        }
        game.endGame();
        await this.pairQuizGamesRepository.save(game);

        if (game.status === GameStatuses.FINISHED) {
          const thisPlayerProgress = game.secondPlayerProgress;
          const otherPlayerProgress = game.firstPlayerProgress;

          let thisUserPlayer =
            await this.pairQuizGamesQueryRepository.getUserPlayer(
              thisPlayerProgress.player.id,
            );

          if (!thisUserPlayer) {
            const newUserPlayerEntity = new UserPlayerEntity(
              thisPlayerProgress.player.id,
              thisPlayerProgress.player.login,
            );
            thisUserPlayer = this.UserPlayerModel.createUserPlayer(
              newUserPlayerEntity,
              this.UserPlayerModel,
            );
          }
          let otherUserPlayer =
            await this.pairQuizGamesQueryRepository.getUserPlayer(
              otherPlayerProgress.player.id,
            );

          if (!otherUserPlayer) {
            const newUserPlayerEntity = new UserPlayerEntity(
              otherPlayerProgress.player.id,
              otherPlayerProgress.player.login,
            );
            otherUserPlayer = this.UserPlayerModel.createUserPlayer(
              newUserPlayerEntity,
              this.UserPlayerModel,
            );
          }

          await this.updateStatistic(thisUserPlayer, game);
          await this.updateStatistic(otherUserPlayer, game);
        }
      }
    }
  }
  private whatTime(date: Date): boolean {
    const thisData = new Date();
    if (date === undefined) return true;
    const dif = date.getTime() - thisData.getTime();
    const second = Math.abs(dif / 1000);
    console.log(second);
    if (second > 10) {
      return false;
    }
    return true;
  }

  private async updateStatistic(player: UserPlayerDocument, game: GamePair) {
    player.gamesCount += 1;
    player.sumScore += await this.pairQuizGamesQueryRepository.score(
      game,
      player.player.id,
    );
    player.avgScores =
      Math.round((player.sumScore / player.gamesCount) * 100) / 100;
    player.winsCount += await this.pairQuizGamesQueryRepository.win(
      game,
      player.player.id,
    );
    player.lossesCount += await this.pairQuizGamesQueryRepository.lose(
      game,
      player.player.id,
    );
    player.drawsCount += await this.pairQuizGamesQueryRepository.draw(
      game,
      player.player.id,
    );
    await this.pairQuizGamesRepository.savePlayer(player);
  }
}
