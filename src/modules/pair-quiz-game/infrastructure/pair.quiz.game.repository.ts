import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { GamePair } from '../domain/model/quiz.game.schema';
import { GamePairDocument } from '../domain/interface/quiz.game.interface';

@Injectable()
export class PairQuizGamesRepository {
  constructor(
    @InjectModel(GamePair.name)
    private readonly gamePairModel: Model<GamePairDocument>,
  ) {}

  async save(model: GamePairDocument) {
    return await model.save();
  }

  async deleteGamePairById(gamePairId: string): Promise<boolean> {
    const GamePairDelete = await this.gamePairModel
      .findOneAndDelete({ _id: new Types.ObjectId(gamePairId) })
      .exec();
    return GamePairDelete ? true : false;
  }
}
