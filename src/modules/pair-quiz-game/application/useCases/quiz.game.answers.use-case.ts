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

export class QuizGameAnswersCommand {
  constructor(public answer: AnswerInputModel, public userId: string) {}
}

@CommandHandler(QuizGameAnswersCommand)
export class QuizGameAnswersUseCase
  implements ICommandHandler<QuizGameAnswersCommand>
{
  constructor(
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

    return saveAnswer;
  }
}
