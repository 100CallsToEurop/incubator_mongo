import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import {
  IUserPlayerInterface,
  UserPlayerDocument,
  UserPlayerModelType,
  UserPlayerStaticType,
} from '../interface/player.interface';
import { IPlayerViewModel } from '../interface/quiz.game.interface';
import { PlayerSchema } from './quiz.game.schema';
import { UserPlayerEntity } from '../entity/player.entity';
import { Document } from 'mongoose';

@Schema({ collection: 'user_player' })
export class UserPlayer extends Document implements IUserPlayerInterface {
  @Prop({ required: true, type: Number })
  sumScore: number;
  @Prop({ required: true, type: Number })
  avgScores: number;
  @Prop({ required: true, type: Number })
  gamesCount: number;
  @Prop({ required: true, type: Number })
  winsCount: number;
  @Prop({ required: true, type: Number })
  lossesCount: number;
  @Prop({ required: true, type: Number })
  drawsCount: number;
  @Prop({ required: true, type: PlayerSchema })
  player: IPlayerViewModel;

  public static createUserPlayer(
    newUserPlayerEntity: UserPlayerEntity,
    UserPlayerModel: UserPlayerModelType,
  ): UserPlayerDocument {
    const newUserPlayer = new UserPlayerModel(newUserPlayerEntity);
    return newUserPlayer;
  }
}

export const UserPlayerSchema = SchemaFactory.createForClass(UserPlayer);

const userPlayerStaticMethod: UserPlayerStaticType = {
  createUserPlayer: UserPlayer.createUserPlayer,
};
UserPlayerSchema.statics = userPlayerStaticMethod;