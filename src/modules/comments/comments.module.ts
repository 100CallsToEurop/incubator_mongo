import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CommentsController } from './api/comments.controller';
import { CommentsService } from './application/comments.service';
import { CommentsSchema } from './domain/model/comment.schema';
import { CommentsRepository } from './infrastructure/comments.repository';
import { Comments } from './domain/model/comment.schema';
import { Post, PostSchema } from '../posts/domain/model/post.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Comments.name, schema: CommentsSchema },
      { name: Post.name, schema: PostSchema },
    ]),
  ],
  controllers: [CommentsController],
  providers: [CommentsService, CommentsRepository],
  exports: [CommentsService],
})
export class CommentsModule {}
