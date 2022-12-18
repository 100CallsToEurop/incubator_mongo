import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { MongooseModule } from '@nestjs/mongoose';
import { PostsModule } from '../posts/posts.module';
import { BlogsController } from './api/blogs.controller';
import { BlogsQueryRepository } from './api/queryRepository/blog.query.repository';
import { BlogsService } from './application/blogs.service';
import {
  CreateBlogUseCase,
  DeleteBlogByIdUseCase,
  UpdateBlogByIdUseCase,
} from './application/useCases';
import { Blog, BlogSchema } from './domain/model/blog.schema';
import { BlogsRepository } from './infrastructure/blogs.repository';

const useCases = [
  UpdateBlogByIdUseCase,
  DeleteBlogByIdUseCase,
  CreateBlogUseCase,
];

@Module({
  imports: [
    CqrsModule,
    MongooseModule.forFeature([{ name: Blog.name, schema: BlogSchema }]),
    PostsModule,
  ],
  controllers: [BlogsController],
  providers: [BlogsService, BlogsRepository, BlogsQueryRepository, ...useCases],
})
export class BlogsModule {}
