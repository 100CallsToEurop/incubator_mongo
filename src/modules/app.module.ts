import { MiddlewareConsumer, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { VideosModule } from './videos/videos.module';
import { TestingModule } from './testing/testing.module';
import { getMongoConfig } from '../configs/mongo.config';
import { BlogsModule } from './blogs/blogs.module';
import { PostsModule } from './posts/posts.module';
import { BasicStrategy } from '../common/strategies/basic.stratefy';
import { PostsController } from './posts/api/posts.controller';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';

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
    UsersModule,
    AuthModule,
  ],
  controllers: [],
  providers: [BasicStrategy],
})
export class AppModule {
}
