import { Module } from '@nestjs/common';
import { VideosController } from './api/videos.controller';
import { VideosService } from './application/videos.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Video, VideoSchema } from './domain/entities/video.schema';
import { VideosRepository } from './infrastructure/videos.repository';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Video.name, schema: VideoSchema }]),
  ],
  controllers: [VideosController],
  providers: [VideosService, VideosRepository],
})
export class VideosModule {}
