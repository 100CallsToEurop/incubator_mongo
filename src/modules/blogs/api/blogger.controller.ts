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
import { CreatePostCommand } from '../../posts/application/useCases';
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
import { GetCurrentUserId } from '../../../common/decorators/get-current-user-id.decorator';

@Controller('blogger/blogs')
export class BloggerController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly blogsQueryRepository: BlogsQueryRepository,
    private readonly postsQueryRepository: PostsQueryRepository,
  ) {}

  @Get()
  async getBlogs(
    @Query() query?: GetQueryParamsBlogDto,
  ): Promise<Paginated<BlogViewModel[]>> {
    return await this.blogsQueryRepository.getBlogs(query);
  }

  @UseGuards(BlogCheckGuard)
  @Get(':id')
  async getBlog(@Param('id') blogId: string): Promise<BlogViewModel> {
    return await this.blogsQueryRepository.getBlogById(blogId);
  }

  @Post()
  async createBlog(
    @Body() createBlogParams: BlogInputModel,
  ): Promise<BlogViewModel> {
    const blogId = await this.commandBus.execute(
      new CreateBlogCommand(createBlogParams),
    );
    return await this.blogsQueryRepository.getBlogById(blogId);
  }

  @UseGuards(BlogCheckGuard)
  @HttpCode(204)
  @Put(':id')
  async updateBlog(
    @Param('id') blogId: string,
    @Body() updateParams: BlogInputModel,
  ) {
    await this.commandBus.execute(
      new UpdateBlogByIdCommand(blogId, updateParams),
    );
  }

  @UseGuards(BlogCheckGuard)
  @HttpCode(204)
  @Delete(':id')
  async deleteBlog(@Param('id') blogId: string) {
    await this.commandBus.execute(new DeleteBlogByIdCommand(blogId));
  }

  @UseGuards(BlogCheckGuard)
  @Post(':blogId/posts')
  async createPostBlog(
    @Param('blogId') blogId: string,
    @Body() createPostParams: BlogPostInputModel,
  ): Promise<PostViewModel> {
    const postId = await this.commandBus.execute(
      new CreatePostCommand({ ...createPostParams, blogId }),
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
}
