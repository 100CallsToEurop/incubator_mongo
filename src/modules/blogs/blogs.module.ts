import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { MongooseModule } from '@nestjs/mongoose';
import { PostsModule } from '../posts/posts.module';
import { BloggerController } from './api/blogger.controller';
import { BlogsController } from './api/blogs.controller';
import { BlogsQueryRepository } from './api/queryRepository/blog.query.repository';
import { BlogsService } from './application/blogs.service';
import {
  BindWithUserUseCase,
  CreateBlogUseCase,
  DeleteBlogByIdUseCase,
  UpdateBlogByIdUseCase,
} from './application/useCases';
import { Blog, BlogSchema } from './domain/model/blog.schema';
import { BlogsRepository } from './infrastructure/blogs.repository';
import { SaController } from './api/sa.controller';
import { UsersModule } from '../users/users.module';
import { Post, PostSchema } from '../posts/domain/model/post.schema';
import {
  Comments,
  CommentsSchema,
} from '../comments/domain/model/comment.schema';
import { BanBlogUseCase } from './application/useCases/ban-blog.use-case';

const useCases = [
  UpdateBlogByIdUseCase,
  DeleteBlogByIdUseCase,
  CreateBlogUseCase,
  BindWithUserUseCase,
  BanBlogUseCase,
];

@Module({
  imports: [
    CqrsModule,
    MongooseModule.forFeature([
      { name: Blog.name, schema: BlogSchema },
      { name: Post.name, schema: PostSchema },
      { name: Comments.name, schema: CommentsSchema },
    ]),
    UsersModule,
    PostsModule,
  ],
  controllers: [
    BlogsController,
    BloggerController,
    SaController,
  ],
  providers: [BlogsService, BlogsRepository, BlogsQueryRepository, ...useCases],
})
export class BlogsModule {}
