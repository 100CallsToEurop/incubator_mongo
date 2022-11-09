import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { CreateVideoInputModel } from '../application/dto/videos.create.model';
import { UpdateVideoInputModel } from '../application/dto/videos.update.model';
import { Video } from '../domain/entities/video.schema';
import { IVideo } from '../domain/interfaces/video.interface';
import add from 'date-fns/add';

@Injectable()
export class VideosRepository {
  constructor(
    @InjectModel(Video.name) private readonly videoModel: Model<Video>,
  ) {}

  async saveVideo(createParams: CreateVideoInputModel): Promise<IVideo> {
    const newVideo = new this.videoModel(createParams);
    newVideo.createdAt = new Date()
    newVideo.publicationDate = add(new Date(), {
      days: 1
    })
    return await newVideo.save();
  }

  async findVideoById(_id: Types.ObjectId): Promise<IVideo> {
    return await this.videoModel.findById({ _id }).exec();
  }

  async findAllVideo(): Promise<IVideo[]> {
    return await this.videoModel.find().exec();
  }

  async updateVideoById(
    _id: Types.ObjectId,
    update: UpdateVideoInputModel,
  ): Promise<boolean> {
    const videoUpdate = await this.videoModel
      .findByIdAndUpdate({ _id }, update)
      .exec();
    return videoUpdate ? true : false;
  }

  async deleteVideoById(_id: Types.ObjectId): Promise<boolean> {
    const videoDelete = await this.videoModel.findByIdAndDelete({ _id }).exec();
    return videoDelete ? true : false;
  }
}
