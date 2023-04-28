import { Types } from 'mongoose';
import {
  AnswerStatuses,
  GameStatuses,
  IAnswerViewModel,
  IGamePairInterface,
  IGamePlayerProgressViewModel,
  IPlayerViewModel,
  IQuestionViewModel,
} from '../interface/quiz.game.interface';
import { QuestionViewModel } from '../../api/models/view';

export class AnswerEntity implements IAnswerViewModel {
  questionId: string;
  answerStatus: AnswerStatuses;
  addedAt: Date;
}

export class PlayerEntity implements IPlayerViewModel {
  id: string;
  login: string;
}

export class GamePlayerProgressEntity implements IGamePlayerProgressViewModel {
  answers: AnswerEntity[];
  player: PlayerEntity;
  score: number;
}

export class QuestionEntity implements IQuestionViewModel {
  id: string;
  body: string;
}

export class GamePairEntity implements IGamePairInterface {
  _id?: Types.ObjectId;
  firstPlayerProgress?: GamePlayerProgressEntity;
  secondPlayerProgress?: GamePlayerProgressEntity;
  questions?: QuestionEntity[];
  status?: GameStatuses;
  pairCreatedDate?: Date;
  startGameDate?: Date;
  finishGameDate?: Date;

  constructor() {
    this._id = new Types.ObjectId();
    this.questions = [];
    this.status = GameStatuses.PENDING_SECOND_PLAYER;
    this.pairCreatedDate = new Date();
  }

  createFirstPlayer(id: string, login: string): void {
    const newPlayer = this.createPlayer(id, login);
    const newGamePlayerProgress = this.createGamePlayerProgress(newPlayer);
    this.firstPlayerProgress = newGamePlayerProgress;
  }

  createSecondPlayer(id: string, login: string): void {
    const newPlayer = this.createPlayer(id, login);
    const newGamePlayerProgress = this.createGamePlayerProgress(newPlayer);
    this.secondPlayerProgress = newGamePlayerProgress;
  }

  addQuestion(questions: Array<QuestionViewModel>): void {
    this.questions = questions;
  }

  private createGamePlayerProgress(
    player: PlayerEntity,
  ): GamePlayerProgressEntity {
    const newGamePlayerProgress = new GamePlayerProgressEntity();
    newGamePlayerProgress.answers = [];
    newGamePlayerProgress.player = player;
    newGamePlayerProgress.score = 0;
    return newGamePlayerProgress;
  }

  private createPlayer(id: string, login: string): PlayerEntity {
    const newPlayer = new PlayerEntity();
    newPlayer.id = id;
    newPlayer.login = login;
    return newPlayer;
  }
}
