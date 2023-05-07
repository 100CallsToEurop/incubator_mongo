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
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { Paginated } from '../../paginator/models/paginator';
import { PaginatorInputModel } from '../../paginator/models/query-params.model';
import { PostImagesViewModel, PostViewModel } from '../../posts/api/queryRepository/dto';
import { PostsQueryRepository } from '../../posts/api/queryRepository/posts.query.repository';
import {
  CreatePostCommand,
  DeletePostByIdCommand,
  UpdatePostByIdCommand,
} from '../../posts/application/useCases';
import { BlogCheckGuard } from '../../../common/guards/blogs/blogs-check.guard';
import {
  CreateBlogCommand,
  DeleteBlogByIdCommand,
  UpdateBlogByIdCommand,
  UploadBlogImagesCommand,
  UploadBlogWallpaperImagesCommand,
  UploadPostImagesCommand,
} from '../application/useCases';
import {
  BlogInputModel,
  BlogPostInputModel,
  GetQueryParamsBlogDto,
} from './models';
import { BlogsQueryRepository } from './queryRepository/blog.query.repository';
import { BlogImagesViewModel, BlogViewModel } from './queryRepository/dto';
import { GetCurrentUser } from '../../../common/decorators/get-current-user.decorator';
import { MeViewModel } from '../../../modules/auth/application/dto';
import { GetCurrentUserId } from '../../../common/decorators/get-current-user-id.decorator';
import { PostCheckGuard } from '../../../common/guards/posts/posts-check.guard';
import { PostCheckOwnerGuard } from '../../../common/guards/posts/posts-check-owner.guard';
import { BlogCheckOwnerGuard } from '../../../common/guards/blogs/blogs-check-owner.guard';
import { BloggerCommentViewModel } from './queryRepository/dto/comments-view-model';
import { FileInterceptor } from '@nestjs/platform-express';

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

  @Get('comments')
  async getAllPostComments(
    @GetCurrentUserId() userId: string,
    @Query() query?: PaginatorInputModel,
  ): Promise<Paginated<BloggerCommentViewModel[]>> {
    return await this.blogsQueryRepository.getAllPostComments(userId, query);
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
  @UseGuards(BlogCheckOwnerGuard)
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
  @UseGuards(BlogCheckOwnerGuard)
  @HttpCode(204)
  @Delete(':id')
  async deleteBlog(@Param('id') blogId: string) {
    await this.commandBus.execute(new DeleteBlogByIdCommand(blogId));
  }

  @UseGuards(BlogCheckGuard)
  @UseGuards(BlogCheckOwnerGuard)
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
  @UseGuards(PostCheckOwnerGuard)
  @HttpCode(204)
  @Put(':blogId/posts/:postId')
  async updatePost(
    @Param('blogId') blogId: string,
    @Param('postId') postId: string,
    @Body() updatePostParams: BlogPostInputModel,
  ) {
    await this.commandBus.execute(
      new UpdatePostByIdCommand(postId, { ...updatePostParams, blogId }),
    );
  }

  @UseGuards(BlogCheckGuard)
  @UseGuards(PostCheckGuard)
  @UseGuards(PostCheckOwnerGuard)
  @HttpCode(204)
  @Delete(':blogId/posts/:postId')
  async deletePost(@Param('postId') postId: string): Promise<void> {
    await this.commandBus.execute(new DeletePostByIdCommand(postId));
  }

  @UseGuards(BlogCheckGuard)
  @Post(':blogId/images/wallpaper')
  @UseInterceptors(FileInterceptor('file'))
  async UploadBlogImagesWallpaper(
    @Param('blogId') blogId: string,
    @GetCurrentUserId() userId: string,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<BlogImagesViewModel> {
    return await this.commandBus.execute(
      new UploadBlogWallpaperImagesCommand(blogId, userId, file),
    );
  }

  @UseGuards(BlogCheckGuard)
  @Post(':blogId/images/main')
  @UseInterceptors(FileInterceptor('file'))
  async UploadBlogImagesMain(
    @Param('blogId') blogId: string,
    @GetCurrentUserId() userId: string,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<BlogImagesViewModel> {
    return await this.commandBus.execute(
      new UploadBlogImagesCommand(blogId, userId, file),
    );
  }

  @UseGuards(BlogCheckGuard)
  @UseGuards(PostCheckGuard)
  @Post(':blogId/posts/:postId/images/main')
  @UseInterceptors(FileInterceptor('file'))
  async UploadPostImages(
    @Param('blogId') blogId: string,
    @Param('postId') postId: string,
    @GetCurrentUserId() userId: string,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<PostImagesViewModel> {
    return await this.commandBus.execute(
      new UploadPostImagesCommand(blogId, postId, userId, file),
    );
  }
}
