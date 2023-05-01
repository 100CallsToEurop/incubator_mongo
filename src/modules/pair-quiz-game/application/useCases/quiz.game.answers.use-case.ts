import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import {
  PairQuizGamesRepository,
  PairQuizGamesQueryRepository,
} from '../../infrastructure';
import { AnswerInputModel } from '../../api/models/input';
import { QuizQueryRepository } from '../../../../modules/quiz/infrastructure';
import {
  AnswerStatuses,
  GameStatuses,
  IAnswerViewModel,
} from '../../domain/interface/quiz.game.interface';
import { ForbiddenException } from '@nestjs/common';
import { UserPlayerEntity } from '../../domain/entity/player.entity';
import { UserPlayer } from '../../domain/model/player.schema';
import { InjectModel } from '@nestjs/mongoose';
import {
  UserPlayerDocument,
  UserPlayerModelType,
} from '../../domain/interface/player.interface';
import { GamePair } from '../../domain/model/quiz.game.schema';

export class QuizGameAnswersCommand {
  constructor(public answer: AnswerInputModel, public userId: string) {}
}

@CommandHandler(QuizGameAnswersCommand)
export class QuizGameAnswersUseCase
  implements ICommandHandler<QuizGameAnswersCommand>
{
  constructor(
    @InjectModel(UserPlayer.name)
    private readonly UserPlayerModel: UserPlayerModelType,
    private readonly pairQuizGamesRepository: PairQuizGamesRepository,
    private readonly pairQuizGamesQueryRepository: PairQuizGamesQueryRepository,
    private readonly quizQueryRepository: QuizQueryRepository,
  ) {}

  async execute({
    answer,
    userId,
  }: QuizGameAnswersCommand): Promise<IAnswerViewModel> {
    const currentGamePair =
      await this.pairQuizGamesQueryRepository.getCurrentGamePair(userId);

    if (
      !currentGamePair ||
      currentGamePair.status === GameStatuses.PENDING_SECOND_PLAYER
    ) {
      throw new ForbiddenException();
    }
    const currentIdQuestionPlayer =
      currentGamePair.getCurrentQuestionId(userId);

    //Если на все отвечено
    if (!currentIdQuestionPlayer) {
      throw new ForbiddenException();
    }

    console.log('еще не отвечено');

    const getQuestionsInfo = await this.quizQueryRepository.getQuestionById(
      currentIdQuestionPlayer,
    );

    let correctAnswer;

    getQuestionsInfo.correctAnswers.includes(answer.answer)
      ? (correctAnswer = AnswerStatuses.CORRECT)
      : (correctAnswer = AnswerStatuses.INCORRECT);

    const saveAnswer = currentGamePair.giveAnAnswer(
      currentIdQuestionPlayer,
      correctAnswer,
      userId,
    );

    await this.pairQuizGamesRepository.save(currentGamePair);

    if (currentGamePair.status === GameStatuses.FINISHED) {
      const { thisPlayerProgress, otherPlayerProgress } =
        currentGamePair.whoPlayer(userId);

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

      await this.updateStatistic(thisUserPlayer, currentGamePair);
      await this.updateStatistic(otherUserPlayer, currentGamePair);
    }
    return saveAnswer;
  }

  private async updateStatistic(
    player: UserPlayerDocument,
    currentGamePair: GamePair,
  ) {
    console.log(player.sumScore);
    player.gamesCount += 1;
    player.sumScore += await this.pairQuizGamesQueryRepository.score(
      currentGamePair,
      player.player.id,
    );
    player.avgScores =
      Math.round((player.sumScore / player.gamesCount) * 100) / 100;
    player.winsCount += await this.pairQuizGamesQueryRepository.win(
      currentGamePair,
      player.player.id,
    );
    player.lossesCount += await this.pairQuizGamesQueryRepository.lose(
      currentGamePair,
      player.player.id,
    );
    player.drawsCount += await this.pairQuizGamesQueryRepository.draw(
      currentGamePair,
      player.player.id,
    );
    console.log(player.sumScore);
    await this.pairQuizGamesRepository.savePlayer(player);
  }
}
