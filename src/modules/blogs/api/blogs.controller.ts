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

//Dto
import { BlogViewModel } from './queryRepository/dto';

//Guards
import { BasicAuthGuard } from '../../../common/guards/basic-auth.guard';

//Models
import { BlogInputModel, BlogPostInputModel, GetQueryParamsBlogDto } from './models';

//QueryParams
import { PaginatorInputModel } from '../../../modules/paginator/models/query-params.model';

//DTO - Posts
import { PostViewModel } from '../../posts/api/queryRepository/dto';
import { Paginated } from '../../../modules/paginator/models/paginator';
import { PostsQueryRepository } from '../../../modules/posts/api/queryRepository/posts.query.repository';
import { BlogCheckGuard } from '../../../common/guards/blogs/blogs-check.guard';
import { Public } from '../../../common/decorators/public.decorator';
import { BlogsQueryRepository } from './queryRepository/blog.query.repository';
import { CommandBus } from '@nestjs/cqrs';
import {
  CreateBlogCommand,
  DeleteBlogByIdCommand,
  UpdateBlogByIdCommand,
} from '../application/useCases';
import { CreatePostCommand } from '../../../modules/posts/application/useCases';
import { GetCurrentUserIdPublic } from '../../../common/decorators/get-current-user-id-public.decorator';

@Public()
@Controller('blogs')
export class BlogsController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly blogsQueryRepository: BlogsQueryRepository,
    private readonly postsQueryRepository: PostsQueryRepository,
  ) {}

  @Public()
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

  @UseGuards(BasicAuthGuard)
  @Post()
  async createBlog(
    @Body() createBlogParams: BlogInputModel,
  ): Promise<BlogViewModel> {
    const blogId = await this.commandBus.execute(
      new CreateBlogCommand(createBlogParams),
    );
    return await this.blogsQueryRepository.getBlogById(blogId);
  }

  @UseGuards(BasicAuthGuard)
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

  @UseGuards(BasicAuthGuard)
  @UseGuards(BlogCheckGuard)
  @HttpCode(204)
  @Delete(':id')
  async deleteBlog(@Param('id') blogId: string) {
    await this.commandBus.execute(new DeleteBlogByIdCommand(blogId));
  }

  @UseGuards(BasicAuthGuard)
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
    @GetCurrentUserIdPublic() userId: string,
    @Param('blogId') blogId: string,
    @Query() query?: PaginatorInputModel,
  ): Promise<Paginated<PostViewModel[]>> {
    return await this.postsQueryRepository.getPosts(query, blogId, userId);
  }
}
