import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ParseObjectIdPipe } from '../../../common/pipe/validation.objectid.pipe';
import { BlogsService } from '../application/blogs.service';
import { BlogDto } from '../application/dto/blog.dto';
import {
  BlogPaginator,
  BlogViewModel,
} from '../application/types/blog-view-model.type';
import { Types } from 'mongoose';
import { BasicAuthGuard } from '../../../common/guards/basic-auth.guard';
import { BlogPostDto } from '../application/dto/blog-post.dto';
import {
  PostPaginator,
  PostViewModel,
} from '../../../modules/posts/application/types/post-view-model';
import { GetQueryParamsBlogDto } from './model/blog-query.dto';
import { GetQueryParamsDto } from '../../../modules/paginator/dto/query-params.dto';

@Controller('blogs')
export class BlogsController {
  constructor(private readonly blogsService: BlogsService) {}

  @Get()
  async getBlogs(
    @Query() query?: GetQueryParamsBlogDto,
  ): Promise<BlogPaginator> {
    return await this.blogsService.getBlogs(query);
  }

  @Get(':id')
  async getBlog(
    @Param('id', ParseObjectIdPipe) id: Types.ObjectId,
  ): Promise<BlogViewModel> {
    return await this.blogsService.getBlogById(id);
  }

  @UseGuards(BasicAuthGuard)
  @Post()
  async createBlog(@Body() createBlogParams: BlogDto): Promise<BlogViewModel> {
    return await this.blogsService.createBlog(createBlogParams);
  }

  @UseGuards(BasicAuthGuard)
  @HttpCode(204)
  @Put(':id')
  async updateBlog(
    @Param('id', ParseObjectIdPipe) id: Types.ObjectId,
    @Body() updateParams: BlogDto,
  ) {
    await this.blogsService.updateBlogById(id, updateParams);
  }

  @UseGuards(BasicAuthGuard)
  @HttpCode(204)
  @Delete(':id')
  async deleteBlog(@Param('id', ParseObjectIdPipe) id: Types.ObjectId) {
    await this.blogsService.deleteBlogById(id);
  }

  @UseGuards(BasicAuthGuard)
  @Post(':blogId/posts')
  async createPostBlog(
    @Param('blogId') blogId: string,
    @Body() createPostParams: BlogPostDto,
  ): Promise<PostViewModel> {
    return await this.blogsService.createPostBlog(blogId, createPostParams);
  }

  @Get(':blogId/posts')
  async getPostsBlog(
    @Param('blogId') blogId: string,
    @Query() query?: GetQueryParamsDto,
  ): Promise<PostPaginator> {
    return await this.blogsService.getPostsBlog(blogId, query);
  }
}
