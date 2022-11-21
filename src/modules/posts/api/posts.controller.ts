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
  Req,
  UseGuards,
} from '@nestjs/common';
import { Types } from 'mongoose';

//Decorators
import { Public } from '../../../common/decorators/public.decorator';
import { GetCurrentUser } from '../../../common/decorators/get-current-user.decorator';

//Services
import { PostsService } from '../application/posts.service';
import { CommentsService } from '../../../modules/comments/application/comments.service';


//DTO
import { PostPaginator, PostViewModel } from '../application/dto';

//Pipe
import { ParseObjectIdPipe } from '../../../common/pipe/validation.objectid.pipe';

//Models
import { LikeInputModel, PostInputModel } from './models';

//Guards
import { BasicAuthGuard } from '../../../common/guards/basic-auth.guard';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';

//QueryParams
import { PaginatorInputModel } from '../../paginator/models/query-params.model';

//DTO - comments
import {
  CommentPaginator,
  CommentViewModel,
} from '../../../modules/comments/application/dto';
//Models = comments
import { CommentInputModel } from '../../../modules/comments/api/models';

//DTO - auth
import { MeViewModel } from '../../../modules/auth/application/dto';
import { GetCurrentUserId } from '../../../common/decorators/get-current-user-id.decorator';
import { PostCheckGuard } from '../../../common/guards/posts/posts-check.guard';

@Controller('posts')
export class PostsController {
  constructor(
    private readonly postsService: PostsService,
    private readonly commentsService: CommentsService,
  ) {}

  @Get()
  async getPosts(
    @Query() query?: PaginatorInputModel,
    @GetCurrentUserId() userId?: string,
  ): Promise<PostPaginator> {
    return await this.postsService.getPosts(query, userId);
  }

  @Get(':id')
  async getPost(
    @Param('id', ParseObjectIdPipe) id: Types.ObjectId,
    @GetCurrentUserId() userId: string,
  ): Promise<PostViewModel> {
    return await this.postsService.getPostById(id, userId);
  }

  @UseGuards(BasicAuthGuard)
  @HttpCode(204)
  @Delete(':id')
  async deletePost(
    @Param('id', ParseObjectIdPipe) id: Types.ObjectId,
  ): Promise<void> {
    await this.postsService.deletePostById(id);
  }

  @UseGuards(BasicAuthGuard)
  @Post()
  async createPost(
    @Body() createPostParams: PostInputModel,
  ): Promise<PostViewModel> {
    return await this.postsService.createPost(createPostParams);
  }

  @UseGuards(BasicAuthGuard)
  @HttpCode(204)
  @Put(':id')
  async updatePost(
    @Param('id', ParseObjectIdPipe) id: Types.ObjectId,
    @Body() updatePostParams: PostInputModel,
  ) {
    await this.postsService.updatePostById(id, updatePostParams);
  }

  @UseGuards(JwtAuthGuard)
  @Post(':postId/comments')
  async createComment(
    @Param('postId') postId: string,
    @GetCurrentUser()
    user: MeViewModel,
    @Body() createCommentParams: CommentInputModel,
  ): Promise<CommentViewModel> {
    return await this.commentsService.createComment(
      postId,
      createCommentParams,
      user,
    );
  }

  @Public()
  @Get(':postId/comments')
  async getComments(
    @Param('postId') postId: string,
    @Query() query?: PaginatorInputModel,
  ): Promise<CommentPaginator> {
    return await this.commentsService.getComments(query, postId);
  }

  @UseGuards(JwtAuthGuard)
  @UseGuards(PostCheckGuard)
  @HttpCode(204)
  @Put(':postId/like-status')
  async updateCommentLikeStatus(
    @GetCurrentUser() user: MeViewModel,
    @Param('postId', ParseObjectIdPipe)
    postId: Types.ObjectId,
    @Body() likeStatus: LikeInputModel,
  ) {
    await this.postsService.updateExtendedLikeStatus(postId, likeStatus, user);
  }
}
