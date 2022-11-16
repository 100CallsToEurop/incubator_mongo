import { Module } from '@nestjs/common';
import { Video, VideoSchema } from '../videos/domain/entities/video.schema';
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

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Post.name, schema: PostSchema },
      { name: Blog.name, schema: BlogSchema },
      { name: Video.name, schema: VideoSchema },
      { name: User.name, schema: UserSchema },
      { name: Comments.name, schema: CommentsSchema },
      { name: SecurityDevice.name, schema: SecutityDeviceSchema },
    ]),
  ],
  controllers: [TestingController],
  providers: [TestingQueryRepository],
})
export class TestingModule {}
