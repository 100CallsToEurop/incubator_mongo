import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { СheckBlogMiddleware } from '../../common/middlewares/blogs-check.middleware';
import { PostsModule } from '../posts/posts.module';
import { BlogsController } from './api/blogs.controller';
import { BlogsService } from './application/blogs.service';
import { Blog, BlogSchema } from './domain/model/blog.schema';
import { BlogsRepository } from './infrastructure/blogs.repository';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Blog.name, schema: BlogSchema }]),
    PostsModule,
  ],
  controllers: [BlogsController],
  providers: [BlogsService, BlogsRepository],
})
export class BlogsModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(СheckBlogMiddleware).forRoutes({
      path: '/blogs/:blogId/posts',
      method: RequestMethod.GET,
    });
  }
}
