import { Module } from '@nestjs/common';
import { TestingController } from './api/testing.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { TestingQueryRepository } from './api/queryRepository/testing.repository';
import { Post, PostSchema } from '../posts/domain/model/post.schema';
import { Blog, BlogSchema } from '../blogs/domain/model/blog.schema';
import { User, UserSchema } from '../users/domain/model/user.schema';
import {
  Comments,
  CommentsSchema,
} from '../comments/domain/model/comment.schema';
import { SecurityDevice, SecutityDeviceSchema } from '../security-devices/domain/model/security-devices.schema';
import { Questions, QuestionsSchema } from '../quiz/domain/model/question.schema';
import { GamePair, GamePairSchema } from '../pair-quiz-game/domain/model/quiz.game.schema';
import { UserPlayer, UserPlayerSchema } from '../pair-quiz-game/domain/model/player.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Questions.name, schema: QuestionsSchema },
      { name: GamePair.name, schema: GamePairSchema },
      { name: Post.name, schema: PostSchema },
      { name: Blog.name, schema: BlogSchema },
      { name: User.name, schema: UserSchema },
      { name: UserPlayer.name, schema: UserPlayerSchema },
      { name: Comments.name, schema: CommentsSchema },
      { name: SecurityDevice.name, schema: SecutityDeviceSchema },
    ]),
  ],
  controllers: [TestingController],
  providers: [TestingQueryRepository],
})
export class TestingModule {}
