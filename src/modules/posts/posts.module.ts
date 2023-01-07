import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { MongooseModule } from '@nestjs/mongoose';
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
import { UsersModule } from '../users/users.module';
import { User, UserSchema } from '../users/domain/model/user.schema';

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
      { name: User.name, schema: UserSchema },
    ]),
    CommentsModule,
  ],
  controllers: [PostsController],
  providers: [
    PostsService,
    PostsRepository,
    IsBlgIdValidatorConstraint,
    PostsQueryRepository,
    ...useCases,
  ],
  exports: [...useCases, PostsQueryRepository, PostsRepository],
})
export class PostsModule {}
