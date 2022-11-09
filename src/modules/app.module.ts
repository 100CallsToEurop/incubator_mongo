import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { VideosModule } from './videos/videos.module';
import { TestingModule } from './testing/testing.module';
import { getMongoConfig } from 'src/configs/mongo.config';


@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.${process.env.NODE_ENV}.env`,
    }),
    MongooseModule.forRootAsync(getMongoConfig()),
    VideosModule,
    TestingModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
