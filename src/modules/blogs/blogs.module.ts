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

const useCases = [
  UpdateBlogByIdUseCase,
  DeleteBlogByIdUseCase,
  CreateBlogUseCase,
  BindWithUserUseCase,
];

@Module({
  imports: [
    CqrsModule,
    MongooseModule.forFeature([{ name: Blog.name, schema: BlogSchema }]),
    UsersModule,
    PostsModule,
  ],
  controllers: [BlogsController, BloggerController, SaController],
  providers: [BlogsService, BlogsRepository, BlogsQueryRepository, ...useCases],
})
export class BlogsModule {}
