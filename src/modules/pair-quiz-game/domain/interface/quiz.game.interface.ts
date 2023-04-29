import { HydratedDocument, Model, Types } from 'mongoose';
import { GamePairEntity } from '../entity/quiz.game.entity';
import { GamePair } from '../model/quiz.game.schema';

export enum GameStatuses {
  PENDING_SECOND_PLAYER = 'PendingSecondPlayer',
  ACTIVE = 'Active',
  FINISHED = 'Finished',
}

export enum AnswerStatuses {
  CORRECT = 'Correct',
  INCORRECT = 'Incorrect',
}

export interface IAnswerViewModel {
  questionId: string;
  answerStatus: AnswerStatuses;
  addedAt: Date;
}

export interface IPlayerViewModel {
  id: string;
  login: string;
}

export interface IGamePlayerProgressViewModel {
  answers: IAnswerViewModel[];
  player: IPlayerViewModel;
  score: number;
}

export interface IQuestionViewModel {
  id: string;
  body: string;
}

export interface IGamePairInterface {
  _id?: Types.ObjectId;
  firstPlayerProgress?: IGamePlayerProgressViewModel;
  secondPlayerProgress?: IGamePlayerProgressViewModel;
  questions?: IQuestionViewModel[];
  status?: GameStatuses;
  pairCreatedDate?: Date;
  startGameDate?: Date;
  finishGameDate?: Date;
}

export interface IGamePairMethods {}

export type IGamePairEntity = IGamePairInterface & IGamePairMethods;

export type GamePairDocument = HydratedDocument<GamePair>;

export type GamePairStaticType = {
  createGamePair: (
    newGamePair: GamePairEntity,
    GamePairModel: GamePairModelType,
  ) => GamePairDocument;
};

export type GamePairModelType = Model<GamePairDocument> & GamePairStaticType;
