import { HydratedDocument, Model, Types } from 'mongoose';
import { IPlayerViewModel } from './quiz.game.interface';
import { UserPlayer } from '../model/player.schema';
import { UserPlayerEntity } from '../entity/player.entity';

export interface IUserPlayerInterface {
  _id?: Types.ObjectId;
  sumScore: number;
  avgScores: number;
  gamesCount: number;
  winsCount: number;
  lossesCount: number;
  drawsCount: number;
  player: IPlayerViewModel;
}


export interface IUserPlayerMethods {}

export type IUserPlayerEntity = IUserPlayerInterface & IUserPlayerMethods;

export type UserPlayerDocument = HydratedDocument<UserPlayer>;

export type UserPlayerStaticType = {
  createUserPlayer: (
    newUserPlayer: UserPlayerEntity,
    UserPlayerModel: UserPlayerModelType,
  ) => UserPlayerDocument;
};

export type UserPlayerModelType = Model<UserPlayerDocument> & UserPlayerStaticType;