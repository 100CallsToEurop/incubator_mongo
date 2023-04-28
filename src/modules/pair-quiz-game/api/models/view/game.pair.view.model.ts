import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { AnswerStatuses, GameStatuses, IGamePlayerProgressViewModel } from '../../../../../modules/pair-quiz-game/domain/interface/quiz.game.interface';


export class AnswerViewModel {
  @IsNotEmpty()
  @IsString()
  questionId: string;

  @IsOptional()
  @IsString()
  @IsEnum(AnswerStatuses)
  answerStatus: AnswerStatuses;

  @IsOptional()
  @IsString()
  addedAt: string;
}

export class PlayerViewModel {
  @IsNotEmpty()
  @IsString()
  id: string;
  @IsNotEmpty()
  @IsString()
  login: string;
}

export class GamePlayerProgressViewModel {
  @IsNotEmpty()
  answers: AnswerViewModel[];
  @IsNotEmpty()
  player: PlayerViewModel;
  @IsNumber()
  score: number;
}

export class QuestionViewModel {
  @IsNotEmpty()
  @IsString()
  id: string;

  @IsNotEmpty()
  @IsString()
  body: string;
}

export class GamePairViewModel {
  @IsString()
  @IsNotEmpty()
  id: string;

  @IsNotEmpty()
  firstPlayerProgress: IGamePlayerProgressViewModel;

  @IsOptional()
  secondPlayerProgress: IGamePlayerProgressViewModel;

  @IsOptional()
  questions: QuestionViewModel[];

  @IsOptional()
  @IsEnum(GameStatuses)
  @IsString()
  status: GameStatuses;

  @IsOptional()
  pairCreatedDate: string;

  @IsOptional()
  startGameDate: string;

  @IsOptional()
  finishGameDate: string;
}
