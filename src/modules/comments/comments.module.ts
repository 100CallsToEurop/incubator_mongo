import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CommentsController } from './api/comments.controller';
import { CommentsService } from './application/comments.service';
import { Comments, CommentsSchema } from './domain/model/comment.schema';
import { CommentsRepository } from './infrastructure/comments.repository';
import { Post, PostSchema } from '../posts/domain/model/post.schema';
import { CommentsQueryRepository } from './api/queryRepository/comments.query.repository';
import {
  CreateCommentUseCase,
  DeleteCommentByIdUseCase,
  UpdateCommentByIdUseCase,
  UpdateLikeStatusUseCase,
} from './application/useCases';
import { CqrsModule } from '@nestjs/cqrs';

const useCases = [
  UpdateLikeStatusUseCase,
  UpdateCommentByIdUseCase,
  DeleteCommentByIdUseCase,
  CreateCommentUseCase,
];

@Module({
  imports: [
    CqrsModule,
    MongooseModule.forFeature([
      { name: Comments.name, schema: CommentsSchema },
      { name: Post.name, schema: PostSchema },
    ]),
  ],
  controllers: [CommentsController],
  providers: [
    CommentsService,
    CommentsRepository,
    CommentsQueryRepository,
    ...useCases,
  ],
  exports: [...useCases, CommentsQueryRepository],
})
export class CommentsModule {}
