import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Video } from '../../../../modules/videos/domain/entities/video.schema';

@Injectable()
export class TestingQueryRepository {
  constructor(
    @InjectModel(Video.name) private readonly videoModel: Model<Video>,
  ) {}

  async deleteAll() {
    await this.videoModel.deleteMany({});
  }
}
