import { Injectable, NotFoundException } from '@nestjs/common';
import { IVideo } from '../domain/interfaces/video.interface';
import { VideosRepository } from '../infrastructure/videos.repository';
import { Types } from 'mongoose';
import { CreateVideoInputModel } from './dto/videos.create.model';
import { UpdateVideoInputModel } from './dto/videos.update.model';
import { VideoView } from './types/videos.type';

@Injectable()
export class VideosService {
  constructor(private readonly videosRepository: VideosRepository) {}

  buildResponseVideo(video: IVideo): VideoView {
    return {
      id: video.id,
      title: video.title,
      author: video.author,
      canBeDownloaded: video.canBeDownloaded,
      minAgeRestriction: video.minAgeRestriction,
      createdAt: video.createdAt.toISOString(),
      publicationDate: video.publicationDate.toISOString(),
      availableResolutions: video.availableResolutions,
    };
  }

  async createVideo(createVideoDto: CreateVideoInputModel): Promise<VideoView> {
    const newVideo = await this.videosRepository.saveVideo(createVideoDto);
    return this.buildResponseVideo(newVideo);
  }

  async findAllVideos(): Promise<VideoView[]> {
    const videos = await this.videosRepository.findAllVideo();
    return videos.map((v) => this.buildResponseVideo(v));
  }

  async findVideo(id: number): Promise<VideoView> {
    const video = await this.videosRepository.findVideoById(id);
    if (!video) {
      throw new NotFoundException();
    }
    return this.buildResponseVideo(video);
  }

  async updateVideo(
    id: number,
    updateVideoDto: UpdateVideoInputModel,
  ): Promise<void> {
    await this.findVideo(id);
    await this.videosRepository.updateVideoById(id, updateVideoDto);
  }

  async removeVideo(id: number): Promise<void> {
    await this.findVideo(id);
    await this.videosRepository.deleteVideoById(id);
  }
}
