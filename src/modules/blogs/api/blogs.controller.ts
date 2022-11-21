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
import { Types } from 'mongoose';

//Services
import { BlogsService } from '../application/blogs.service';
import { PostsService } from '../../../modules/posts/application/posts.service';

//Dto
import { BlogPaginator, BlogViewModel } from '../application/dto';

//Pipes
import { ParseObjectIdPipe } from '../../../common/pipe/validation.objectid.pipe';

//Guards
import { BasicAuthGuard } from '../../../common/guards/basic-auth.guard';

//Models
import {
  BlogInputModel,
  GetQueryParamsBlogDto,
  BlogPostInputModel,
} from './models';

//QueryParams
import { PaginatorInputModel } from '../../../modules/paginator/models/query-params.model';

//DTO - Posts
import { PostPaginator, PostViewModel } from '../../posts/application/dto';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';
import { Public } from '../../../common/decorators/public.decorator';
import { GetCurrentUserIdPublic } from '../../../common/decorators/get-current-user-id-public.decorator';

@Controller('blogs')
export class BlogsController {
  constructor(
    private readonly blogsService: BlogsService,
    private readonly postsService: PostsService,
  ) {}

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
  async createBlog(
    @Body() createBlogParams: BlogInputModel,
  ): Promise<BlogViewModel> {
    return await this.blogsService.createBlog(createBlogParams);
  }

  @UseGuards(BasicAuthGuard)
  @HttpCode(204)
  @Put(':id')
  async updateBlog(
    @Param('id', ParseObjectIdPipe) id: Types.ObjectId,
    @Body() updateParams: BlogInputModel,
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
    @Body() createPostParams: BlogPostInputModel,
  ): Promise<PostViewModel> {
    return await this.postsService.createPost({ ...createPostParams, blogId});
  }

  @UseGuards(JwtAuthGuard)
  @Public()
  @Get(':blogId/posts')
  async getPostsBlog(
    @GetCurrentUserIdPublic() userId: string | null,
    @Param('blogId') blogId: string,
    @Query() query?: PaginatorInputModel,
  ): Promise<PostPaginator> {
    return await this.postsService.getPosts(query, blogId, userId);
  }
}
