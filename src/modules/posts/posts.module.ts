import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { IsBlgIdValidatorConstraint } from '../../common/decorators/check-blog-id.decorator';
import { Blog, BlogSchema } from '../blogs/domain/model/blog.schema';
import { PostsController } from './api/posts.controller';
import { PostsService } from './application/posts.service';
import { Post, PostSchema } from './domain/model/post.schema';
import { PostsRepository } from './infrastructure/posts.repository';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Post.name, schema: PostSchema }]),
    MongooseModule.forFeature([{ name: Blog.name, schema: BlogSchema }]),
  ],
  controllers: [PostsController],
  providers: [PostsService, PostsRepository, IsBlgIdValidatorConstraint],
  exports: [PostsService],
})
export class PostsModule {}
