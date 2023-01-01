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
import { CommandBus } from '@nestjs/cqrs';
import { Paginated } from '../../paginator/models/paginator';
import { PaginatorInputModel } from '../../paginator/models/query-params.model';
import { PostViewModel } from '../../posts/api/queryRepository/dto';
import { PostsQueryRepository } from '../../posts/api/queryRepository/posts.query.repository';
import { CreatePostCommand, DeletePostByIdCommand, UpdatePostByIdCommand } from '../../posts/application/useCases';
import { BlogCheckGuard } from '../../../common/guards/blogs/blogs-check.guard';
import {
  CreateBlogCommand,
  DeleteBlogByIdCommand,
  UpdateBlogByIdCommand,
} from '../application/useCases';
import {
  BlogInputModel,
  BlogPostInputModel,
  GetQueryParamsBlogDto,
} from './models';
import { BlogsQueryRepository } from './queryRepository/blog.query.repository';
import { BlogViewModel } from './queryRepository/dto';
import { GetCurrentUser } from '../../../common/decorators/get-current-user.decorator';
import { MeViewModel } from '../../../modules/auth/application/dto';
import { GetCurrentUserId } from '../../../common/decorators/get-current-user-id.decorator';
import { PostCheckGuard } from '../../../common/guards/posts/posts-check.guard';
import { PostInputModel } from 'src/modules/posts/api/models';

@Controller('blogger/blogs')
export class BloggerController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly blogsQueryRepository: BlogsQueryRepository,
    private readonly postsQueryRepository: PostsQueryRepository,
  ) {}

  @Get()
  async getBlogs(
    @GetCurrentUserId() userId: string,
    @Query() query?: GetQueryParamsBlogDto,
  ): Promise<Paginated<BlogViewModel[]>> {
    return await this.blogsQueryRepository.getBlogs(query, userId);
  }

  @UseGuards(BlogCheckGuard)
  @Get(':id')
  async getBlog(@Param('id') blogId: string): Promise<BlogViewModel> {
    return await this.blogsQueryRepository.getBlogById(blogId);
  }

  @Post()
  async createBlog(
    @Body() createBlogParams: BlogInputModel,
    @GetCurrentUser() user: MeViewModel,
  ): Promise<BlogViewModel> {
    const blogId = await this.commandBus.execute(
      new CreateBlogCommand(createBlogParams, user),
    );
    return await this.blogsQueryRepository.getBlogById(blogId);
  }

  @UseGuards(BlogCheckGuard)
  @HttpCode(204)
  @Put(':id')
  async updateBlog(
    @Param('id') blogId: string,
    @GetCurrentUserId() userId: string,
    @Body() updateParams: BlogInputModel,
  ) {
    await this.commandBus.execute(
      new UpdateBlogByIdCommand(blogId, updateParams, userId),
    );
  }

  @UseGuards(BlogCheckGuard)
  @HttpCode(204)
  @Delete(':id')
  async deleteBlog(
    @Param('id') blogId: string,
    @GetCurrentUserId() userId: string,
  ) {
    await this.commandBus.execute(new DeleteBlogByIdCommand(blogId, userId));
  }

  @UseGuards(BlogCheckGuard)
  @Post(':blogId/posts')
  async createPostBlog(
    @Param('blogId') blogId: string,
    @GetCurrentUserId() userId: string,
    @Body() createPostParams: BlogPostInputModel,
  ): Promise<PostViewModel> {
    const postId = await this.commandBus.execute(
      new CreatePostCommand({ ...createPostParams, blogId }, userId),
    );
    return this.postsQueryRepository.getPostById(postId);
  }

  @UseGuards(BlogCheckGuard)
  @Get(':blogId/posts')
  async getPostsBlog(
    @GetCurrentUserId() userId: string,
    @Param('blogId') blogId: string,
    @Query() query?: PaginatorInputModel,
  ): Promise<Paginated<PostViewModel[]>> {
    return await this.postsQueryRepository.getPosts(query, blogId, userId);
  }

  @UseGuards(BlogCheckGuard)
  @UseGuards(PostCheckGuard)
  @HttpCode(204)
  @Put(':blogId/posts/:postId')
  async updatePost(
    @Param('blogId') blogId: string,
    @Param('postId') postId: string,
    @Body() updatePostParams: BlogPostInputModel,
  ) {
    await this.commandBus.execute(
      new UpdatePostByIdCommand(
        postId,
        { ...updatePostParams, blogId },
      ),
    );
  }

  @UseGuards(BlogCheckGuard)
  @UseGuards(PostCheckGuard)
  @HttpCode(204)
  @Delete(':blogId/posts/:postId')
  async deletePost(
    @Param('blogId') blogId: string,
    @Param('postId') postId: string,
  ): Promise<void> {
    await this.commandBus.execute(new DeletePostByIdCommand(postId, blogId));
  }
}
