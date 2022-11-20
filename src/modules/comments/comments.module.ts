import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CommentsController } from './api/comments.controller';
import { CommentsService } from './application/comments.service';
import { Comments, CommentsSchema } from './domain/model/comment.schema';
import { CommentsRepository } from './infrastructure/comments.repository';
import { Post, PostSchema } from '../posts/domain/model/post.schema';
import { TokensModule } from '../tokens/tokens.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Comments.name, schema: CommentsSchema },
      { name: Post.name, schema: PostSchema },
    ]),
    TokensModule,
  ],
  controllers: [CommentsController],
  providers: [CommentsService, CommentsRepository],
  exports: [CommentsService],
})
export class CommentsModule {}
