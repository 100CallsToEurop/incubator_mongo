import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { VideosModule } from './videos/videos.module';
import { TestingModule } from './testing/testing.module';
import { getMongoConfig } from '../configs/mongo.config';
import { BlogsModule } from './blogs/blogs.module';
import { PostsModule } from './posts/posts.module';
import { BasicStrategy } from '../common/strategies/basic.stratefy';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { CommentsModule } from './comments/comments.module';
import { RtStrategy } from '../common/strategies/jwt.refresh.strategy';
import { AtStrategy } from '../common/strategies/jwt.strategy';
import { TokensModule } from './tokens/tokens.module';

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
    CommentsModule,
    TokensModule,
  ],
  controllers: [],
  providers: [AtStrategy, /*RtStrategy,*/ BasicStrategy],
})
export class AppModule {}
