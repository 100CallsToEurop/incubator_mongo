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
import { UserPlayerModelType } from '../../domain/interface/player.interface';

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
      const players = currentGamePair.whoPlayer(userId);

      const playerThisInfo = players.thisPlayerProgress;
      const playerOtherInfo = players.otherPlayerProgress;

      let thisUserPlayer =
        await this.pairQuizGamesQueryRepository.getUserPlayer(
          playerThisInfo.player.id,
        );

      let otherUserPlayer =
        await this.pairQuizGamesQueryRepository.getUserPlayer(
          playerOtherInfo.player.id,
        );

      if (!thisUserPlayer) {
        const newUserPlayerEntity = new UserPlayerEntity(
          playerThisInfo.player.id,
          playerThisInfo.player.login,
        );
        thisUserPlayer = this.UserPlayerModel.createUserPlayer(
          newUserPlayerEntity,
          this.UserPlayerModel,
        );

        if (!otherUserPlayer) {
          const newUserPlayerEntity = new UserPlayerEntity(
            playerOtherInfo.player.id,
            playerOtherInfo.player.login,
          );
          otherUserPlayer = this.UserPlayerModel.createUserPlayer(
            newUserPlayerEntity,
            this.UserPlayerModel,
          );
        }

        thisUserPlayer.gamesCount++;
        thisUserPlayer.sumScore +=
          await this.pairQuizGamesQueryRepository.score(
            currentGamePair,
            userId,
          );
        thisUserPlayer.avgScores =
          Math.round(
            (thisUserPlayer.sumScore / thisUserPlayer.gamesCount) * 100,
          ) / 100;
        thisUserPlayer.winsCount += this.pairQuizGamesQueryRepository.win(
          currentGamePair,
          userId,
        );
        thisUserPlayer.lossesCount += this.pairQuizGamesQueryRepository.lose(
          currentGamePair,
          userId,
        );
        thisUserPlayer.drawsCount += this.pairQuizGamesQueryRepository.draw(
          currentGamePair,
          userId,
        );

        otherUserPlayer.gamesCount++;
        otherUserPlayer.sumScore +=
          await this.pairQuizGamesQueryRepository.score(
            currentGamePair,
            otherUserPlayer.player.id,
          );
        otherUserPlayer.avgScores =
          Math.round(
            (otherUserPlayer.sumScore / otherUserPlayer.gamesCount) * 100,
          ) / 100;
        otherUserPlayer.winsCount += this.pairQuizGamesQueryRepository.win(
          currentGamePair,
          otherUserPlayer.player.id,
        );
        otherUserPlayer.lossesCount += this.pairQuizGamesQueryRepository.lose(
          currentGamePair,
          otherUserPlayer.player.id,
        );
        otherUserPlayer.drawsCount+= this.pairQuizGamesQueryRepository.draw(
          currentGamePair,
          otherUserPlayer.player.id,
        );

        await this.pairQuizGamesRepository.savePlayer(thisUserPlayer);
        await this.pairQuizGamesRepository.savePlayer(otherUserPlayer);
      }
    }
    return saveAnswer;
  }
}
