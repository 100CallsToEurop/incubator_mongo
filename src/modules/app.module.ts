import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { VideosModule } from './videos/videos.module';
import { TestingModule } from './testing/testing.module';
import { getMongoConfig } from '../configs/mongo.config';
import { BlogsModule } from './blogs/blogs.module';
import { PostsModule } from './posts/posts.module';


@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.${process.env.NODE_ENV}.env`,
    }),
    MongooseModule.forRootAsync(getMongoConfig()),
    VideosModule,
    TestingModule,
    BlogsModule,
    PostsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
