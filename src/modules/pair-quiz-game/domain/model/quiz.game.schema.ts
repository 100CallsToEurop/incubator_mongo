import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import {
  AnswerStatuses,
  GamePairDocument,
  GamePairModelType,
  GamePairStaticType,
  GameStatuses,
  IAnswerViewModel,
  IGamePairEntity,
  IGamePlayerProgressViewModel,
  IPlayerViewModel,
  IQuestionViewModel,
} from '../interface/quiz.game.interface';
import { GamePairEntity } from '../entity/quiz.game.entity';
import { Document } from 'mongoose';

@Schema({ collection: 'answer' })
export class Answer extends Document implements IAnswerViewModel {
  @Prop({ required: true, type: String })
  questionId: string;
  @Prop({ required: true, type: String, enum: AnswerStatuses })
  answerStatus: AnswerStatuses;
  @Prop({ required: true, type: Date })
  addedAt: Date;
}

export const AnswerSchema = SchemaFactory.createForClass(Answer);

@Schema({ collection: 'player' })
export class Player extends Document implements IPlayerViewModel {
  @Prop({ required: true, type: String })
  id: string;
  @Prop({ required: true, type: String })
  login: string;
}

export const PlayerSchema = SchemaFactory.createForClass(Player);

@Schema({ collection: 'game_player_progress' })
export class GamePlayerProgress
  extends Document
  implements IGamePlayerProgressViewModel
{
  @Prop({ required: true, type: [AnswerSchema] })
  answers: IAnswerViewModel[];
  @Prop({ required: true, type: PlayerSchema })
  player: IPlayerViewModel;
  @Prop({ required: true, type: Number })
  score: number;
}

export const GamePlayerProgressSchema =
  SchemaFactory.createForClass(GamePlayerProgress);

@Schema({ collection: 'question_view_model' })
export class Question extends Document implements IQuestionViewModel {
  @Prop({ required: true, type: String })
  id: string;
  @Prop({ required: true, type: String })
  body: string;
}

export const QuestionSchema = SchemaFactory.createForClass(Question);

@Schema({ collection: 'game_pair' })
export class GamePair extends Document implements IGamePairEntity {
  @Prop({ required: false, type: GamePlayerProgressSchema })
  firstPlayerProgress?: IGamePlayerProgressViewModel;
  @Prop({ required: false, type: GamePlayerProgressSchema })
  secondPlayerProgress?: IGamePlayerProgressViewModel;
  @Prop({ required: false, type: [QuestionSchema] })
  questions?: IQuestionViewModel[];
  @Prop({ required: false, type: String, enum: GameStatuses })
  status?: GameStatuses;
  @Prop({ required: false, type: Date })
  pairCreatedDate?: Date;
  @Prop({ required: false, type: Date })
  startGameDate?: Date;
  @Prop({ required: false, type: Date })
  finishGameDate?: Date;

  public static createGamePair(
    newGamePairEntity: GamePairEntity,
    GamePairModel: GamePairModelType,
  ): GamePairDocument {
    const newGamePair = new GamePairModel(newGamePairEntity);
    return newGamePair;
  }

  public addSecondPlayerInGamePair(gamePairEntity: GamePairEntity): void {
    this.secondPlayerProgress = gamePairEntity.secondPlayerProgress;
    this.questions = gamePairEntity.questions;
    this.status = GameStatuses.ACTIVE;
    this.startGameDate = new Date();
  }

  public endGame(): void {
    this.status = GameStatuses.FINISHED;
    this.finishGameDate = new Date();
  }

  public checkUser(userId: string): boolean {
    let status = false;
    if (
      this.firstPlayerProgress?.player.id === userId &&
      this.secondPlayerProgress === undefined
    ) {
      status = true;
      return status;
    }
    if (this.firstPlayerProgress?.player.id === userId) status = true;
    if (this.secondPlayerProgress?.player.id === userId) status = true;

    return status;
  }

  public whoPlayer(userId: string): {
    thisPlayerProgress: IGamePlayerProgressViewModel;
    otherPlayerProgress: IGamePlayerProgressViewModel;
  } {
    let thisPlayerProgress;
    let otherPlayerProgress;
    this.firstPlayerProgress.player.id === userId
      ? ((thisPlayerProgress = this.firstPlayerProgress),
        (otherPlayerProgress = this.secondPlayerProgress))
      : ((thisPlayerProgress = this.secondPlayerProgress),
        (otherPlayerProgress = this.firstPlayerProgress));

    return {
      thisPlayerProgress,
      otherPlayerProgress,
    };
  }

  public getCurrentQuestionId(userId: string): string | null {
    const players = this.whoPlayer(userId);
    const thisPlayerAnswersLength = players.thisPlayerProgress.answers.length;
    if (this.questions[thisPlayerAnswersLength] === undefined) return null;
    return this.questions[thisPlayerAnswersLength].id;
  }

  public getLastAnswerUser(userId: string) {
    const players = this.whoPlayer(userId);
    return players.thisPlayerProgress.answers.at(-1);
  }

 
  public giveAnAnswer(
    questionId: string,
    answerStatus: AnswerStatuses,
    userId: string,
  ): IAnswerViewModel {
    const players = this.whoPlayer(userId);
    const thisPlayerAnswersLength = players.thisPlayerProgress.answers.length;
    const otherPlayerAnswersLength = players.otherPlayerProgress.answers.length;

    const checkEndGameOtherPlayer =
      thisPlayerAnswersLength < 5 && otherPlayerAnswersLength === 5;

    const newAnswer: IAnswerViewModel = {
      questionId: questionId,
      answerStatus: answerStatus,
      addedAt: new Date(),
    };

    if (answerStatus === AnswerStatuses.CORRECT) {
      players.thisPlayerProgress.score++;
    }

  
    if (thisPlayerAnswersLength === 4 && otherPlayerAnswersLength === 5) {
      if (checkEndGameOtherPlayer && players.otherPlayerProgress.score !== 0) {
        players.otherPlayerProgress.score++;
      }
      this.endGame();
    }

    players.thisPlayerProgress.answers.push(newAnswer);

    return newAnswer;
  }
}
export const GamePairSchema = SchemaFactory.createForClass(GamePair);

const gamePairStaticMethod: GamePairStaticType = {
  createGamePair: GamePair.createGamePair,
};
GamePairSchema.statics = gamePairStaticMethod;

GamePairSchema.methods.addSecondPlayerInGamePair =
  GamePair.prototype.addSecondPlayerInGamePair;

GamePairSchema.methods.giveAnAnswer = GamePair.prototype.giveAnAnswer;
GamePairSchema.methods.whoPlayer = GamePair.prototype.whoPlayer;
GamePairSchema.methods.getCurrentQuestionId =
  GamePair.prototype.getCurrentQuestionId;
GamePairSchema.methods.endGame = GamePair.prototype.endGame;
GamePairSchema.methods.checkUser = GamePair.prototype.checkUser;
GamePairSchema.methods.getLastAnswerUser = GamePair.prototype.getLastAnswerUser;
