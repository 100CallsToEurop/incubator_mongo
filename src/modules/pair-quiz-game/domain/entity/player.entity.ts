import { Types } from "mongoose";
import { IUserPlayerInterface } from "../interface/player.interface";
import { PlayerEntity } from "./quiz.game.entity";

export class UserPlayerEntity implements IUserPlayerInterface {
  _id?: Types.ObjectId;
  sumScore: number;
  avgScores: number;
  gamesCount: number;
  winsCount: number;
  lossesCount: number;
  drawsCount: number;
  player: PlayerEntity;

  constructor(id: string, login: string) {
    this._id = new Types.ObjectId();
    this.sumScore = 0,
    this.avgScores = 0,
    this.gamesCount = 0,
    this.winsCount = 0,
    this.lossesCount = 0,
    this.drawsCount = 0,
    this.player.id = id
    this.player.login = login;
  }
}