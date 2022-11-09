import { Module } from '@nestjs/common';
import { Video, VideoSchema } from '../videos/domain/entities/video.schema';
import { TestingController } from './api/testing.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { TestingQueryRepository } from './api/queryRepository/testing.repository';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Video.name, schema: VideoSchema }]),
  ],
  controllers: [TestingController],
  providers: [TestingQueryRepository],
})
export class TestingModule {}
