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

import { Public } from '../../../common/decorators/public.decorator';
import { GetCurrentUser } from '../../../common/decorators/get-current-user.decorator';

import { PostViewModel } from './queryRepository/dto';
import { LikeInputModel, PostInputModel } from './models';

import { BasicAuthGuard } from '../../../common/guards/basic-auth.guard';

import { PaginatorInputModel } from '../../paginator/models/query-params.model';

import { CommentViewModel } from '../../comments/api/queryRepository/dto';

import { CommentInputModel } from '../../../modules/comments/api/models';

import { MeViewModel } from '../../../modules/auth/application/dto';
import { PostCheckGuard } from '../../../common/guards/posts/posts-check.guard';
import { CommentsQueryRepository } from '../../../modules/comments/api/queryRepository/comments.query.repository';
import { Paginated } from '../../../modules/paginator/models/paginator';
import { PostsQueryRepository } from './queryRepository/posts.query.repository';
import { CommandBus } from '@nestjs/cqrs';
import {
  CreatePostCommand,
  DeletePostByIdCommand,
  UpdateExtendedLikeStausCommand,
  UpdatePostByIdCommand,
} from '../application/useCases';
import { CreateCommentCommand } from '../../../modules/comments/application/useCases';
import { GetCurrentUserId } from '../../../common/decorators/get-current-user-id.decorator';

@Controller('posts')
export class PostsController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly commentsQueryRepository: CommentsQueryRepository,
    private readonly postsQueryRepository: PostsQueryRepository,
  ) {}

  @Public()
  @Get()
  async getPosts(
    @Query() query?: PaginatorInputModel,
  ): Promise<Paginated<PostViewModel[]>> {
    return await this.postsQueryRepository.getPosts(query);
  }

  @Public()
  @UseGuards(PostCheckGuard)
  @Get(':id')
  async getPost(
    @Param('id') postId: string,
  ): Promise<PostViewModel> {
    return await this.postsQueryRepository.getPostById(postId);
  }

  @Public()
  @UseGuards(BasicAuthGuard)
  @UseGuards(PostCheckGuard)
  @HttpCode(204)
  @Delete(':id')
  async deletePost(@Param('id') postId: string): Promise<void> {
    await this.commandBus.execute(new DeletePostByIdCommand(postId));
  }

  @Public()
  @UseGuards(BasicAuthGuard)
  @Post()
  async createPost(
    @Body() createPostParams: PostInputModel,
  ): Promise<PostViewModel> {
    const postId = await this.commandBus.execute(
      new CreatePostCommand(createPostParams),
    );
    return await this.postsQueryRepository.getPostById(postId);
  }

  @Public()
  @UseGuards(BasicAuthGuard)
  @UseGuards(PostCheckGuard)
  @HttpCode(204)
  @Put(':id')
  async updatePost(
    @Param('id') postId: string,
    @Body() updatePostParams: PostInputModel,
  ) {
    await this.commandBus.execute(
      new UpdatePostByIdCommand(postId, updatePostParams),
    );
  }

  @UseGuards(PostCheckGuard)
  @Post(':postId/comments')
  async createComment(
    @Param('postId') postId: string,
    @GetCurrentUser()
    user: MeViewModel,
    @Body() createCommentParams: CommentInputModel,
  ): Promise<CommentViewModel> {
    const commentId = await this.commandBus.execute(
      new CreateCommentCommand(postId, createCommentParams, user),
    );
    return await this.commentsQueryRepository.getCommentById(commentId);
  }

  @Public()
  @UseGuards(PostCheckGuard)
  @Get(':postId/comments')
  async getComments(
    @Param('postId') postId: string,
    @Query() query?: PaginatorInputModel,
  ): Promise<Paginated<CommentViewModel[]>> {
    return await this.commentsQueryRepository.getComments(query, postId);
  }

  @UseGuards(PostCheckGuard)
  @HttpCode(204)
  @Put(':postId/like-status')
  async updateCommentLikeStatus(
    @GetCurrentUserId() user: MeViewModel,
    @Param('postId') postId: string,
    @Body() likeStatus: LikeInputModel,
  ) {
    await this.commandBus.execute(
      new UpdateExtendedLikeStausCommand(postId, likeStatus, user),
    );
  }
}
