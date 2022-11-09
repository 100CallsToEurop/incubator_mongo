import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { CreateVideoInputModel } from '../application/dto/videos.create.model';
import { UpdateVideoInputModel } from '../application/dto/videos.update.model';
import { Video } from '../domain/entities/video.schema';
import { IVideo } from '../domain/interfaces/video.interface';

@Injectable()
export class VideosRepository {
  constructor(
    @InjectModel(Video.name) private readonly videoModel: Model<Video>,
  ) {}

  async saveVideo(createParams: CreateVideoInputModel): Promise<IVideo> {
    const newVideo = new this.videoModel(createParams);
    newVideo.id = Math.floor(Math.random() * 200);
    const D = new Date();
    D.setDate(D.getDate() + 1);
    newVideo.createdAt = new Date();
    newVideo.publicationDate = D;
    return await newVideo.save();
  }

  async findVideoById(id: number): Promise<IVideo> {
    return await this.videoModel.findOne({ id }).exec();
  }

  async findAllVideo(): Promise<IVideo[]> {
    return await this.videoModel.find().exec();
  }

  async updateVideoById(
    id: number,
    update: UpdateVideoInputModel,
  ): Promise<boolean> {
    const videoUpdate = await this.videoModel
      .findOneAndUpdate({ id }, update)
      .exec();
    return videoUpdate ? true : false;
  }

  async deleteVideoById(id: number): Promise<boolean> {
    const videoDelete = await this.videoModel.findOneAndDelete({ id }).exec();
    return videoDelete ? true : false;
  }
}
