import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { CqrsModule } from '@nestjs/cqrs';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtAuthRefreshGuard } from '../../common/guards/jwt-auth.refresh.guard';
import { IsBlgIdValidatorConstraint } from '../../common/decorators/check-blog-id.decorator';
import { Blog, BlogSchema } from '../blogs/domain/model/blog.schema';
import { CommentsModule } from '../comments/comments.module';
import { PostsController } from './api/posts.controller';
import { PostsQueryRepository } from './api/queryRepository/posts.query.repository';
import { PostsService } from './application/posts.service';
import {
  CreatePostUseCase,
  DeletePostByIdUseCase,
  UpdateExtendedLikeStausUseCase,
  UpdatePostByIdUseCase,
} from './application/useCases';
import { Post, PostSchema } from './domain/model/post.schema';
import { PostsRepository } from './infrastructure/posts.repository';

const useCases = [
  UpdatePostByIdUseCase,
  UpdateExtendedLikeStausUseCase,
  DeletePostByIdUseCase,
  CreatePostUseCase,
];

@Module({
  imports: [
    CqrsModule,
    MongooseModule.forFeature([
      { name: Post.name, schema: PostSchema },
      { name: Blog.name, schema: BlogSchema },
    ]),
    CommentsModule,
  ],
  controllers: [PostsController],
  providers: [
    PostsService,
    PostsRepository,
    IsBlgIdValidatorConstraint,
    PostsQueryRepository,
    ...useCases
  ],
  exports: [...useCases, PostsQueryRepository],
})
export class PostsModule {}
