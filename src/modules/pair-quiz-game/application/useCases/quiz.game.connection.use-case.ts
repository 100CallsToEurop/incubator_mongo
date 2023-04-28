import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import {
  PairQuizGamesRepository,
  PairQuizGamesQueryRepository,
} from '../../infrastructure';
import { InjectModel } from '@nestjs/mongoose';
import { GamePairModelType } from '../../domain/interface/quiz.game.interface';
import { GamePair } from '../../domain/model/quiz.game.schema';
import { GamePairEntity } from '../../domain/entity/quiz.game.entity';
import { UsersQueryRepository } from '../../../../modules/users/api/queryRepository/users.query.repository';
import { QuizQueryRepository } from '../../../../modules/quiz/infrastructure';

export class QuizGameConnectionCommand {
  constructor(public userId: string) {}
}

@CommandHandler(QuizGameConnectionCommand)
export class QuizGameConnectionUseCase
  implements ICommandHandler<QuizGameConnectionCommand>
{
  constructor(
    @InjectModel(GamePair.name)
    private readonly gamePairModel: GamePairModelType,
    private readonly pairQuizGamesRepository: PairQuizGamesRepository,
    private readonly pairQuizGamesQueryRepository: PairQuizGamesQueryRepository,
    private readonly usersQueryRepository: UsersQueryRepository,
    private readonly quizQueryRepository: QuizQueryRepository,
  ) {}
  async execute({ userId }: QuizGameConnectionCommand): Promise<string> {
    const { id, login } = await this.usersQueryRepository.getUserById(userId);

    const newGamePairEntity = new GamePairEntity();

    let game = await this.pairQuizGamesQueryRepository.checkGamePair();

    if (!game) {
      newGamePairEntity.createFirstPlayer(id, login);
      game = this.gamePairModel.createGamePair(
        newGamePairEntity,
        this.gamePairModel,
      );
    } else {
      const question = await this.quizQueryRepository.getQuestions({
        pageNumber: 1,
        pageSize: 5,
      });
      newGamePairEntity.createSecondPlayer(id, login);
      newGamePairEntity.addQuestion(question.items);
      game.addSecondPlayerInGamePair(newGamePairEntity);
    }

    await this.pairQuizGamesRepository.save(game);
    return game.id;
  }
}
