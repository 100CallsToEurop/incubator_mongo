import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
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
import { ManagersModule } from './managers/managers.module';
import { MailerModule } from '@nestjs-modules/mailer';
import { getMailerConfig } from '../configs/mailer.config';
import { SecurityDevicesModule } from './security-devices/security-devices.module';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { QuizModule } from './quiz/quiz.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.${process.env.NODE_ENV}.env`,
    }),
    MongooseModule.forRootAsync(getMongoConfig()),
    MailerModule.forRootAsync(getMailerConfig()),
    TestingModule,
    BlogsModule,
    PostsModule,
    UsersModule,
    AuthModule,
    CommentsModule,
    TokensModule,
    ManagersModule,
    SecurityDevicesModule,
    QuizModule,
  ],
  controllers: [],
  providers: [
    AtStrategy,
    RtStrategy,
    BasicStrategy,
   // { provide: APP_GUARD, useClass: JwtAuthRefreshGuard },
    { provide: APP_GUARD, useClass: JwtAuthGuard },
  ],
})
export class AppModule {}
