import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { Types } from 'mongoose';

//Decorators
import { Public } from '../../../common/decorators/public.decorator';


//Guards
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';

//Pipe
import { ParseObjectIdPipe } from '../../../common/pipe/validation.objectid.pipe';

//Sort
import { PaginatorInputModel } from '../../../modules/paginator/models/query-params.model';

//Services
import { CommentsService } from '../application/comments.service';

//DTO
import { CommentPaginator, CommentViewModel } from '../application/dto';

//Models
import { CommentInputModel } from './models';

@UseGuards(JwtAuthGuard)
@Controller('comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  /*@Public()
  @Get()
  async getComments(
    @Query() query?: PaginatorInputModel,
  ): Promise<CommentPaginator> {
    return await this.commentsService.getComments(query);
  }*/

  @Public()
  @Get(':id')
  async getComment(
    @Param('id', ParseObjectIdPipe) id: Types.ObjectId,
  ): Promise<CommentViewModel> {
    return await this.commentsService.getCommentById(id);
  }

  /*@Post()
  async createComment(
    @GetCurrentUser() user: MeViewModel,
    @Body() createCommentParams: CommentInputModel,
  ): Promise<CommentViewModel> {
    return await this.commentsService.createComment(createCommentParams, user);
  }*/

  @HttpCode(204)
  @Put(':commentId')
  async updateComment(
    @Param('commentId', ParseObjectIdPipe) id: Types.ObjectId,
    @Body() updateParams: CommentInputModel,
  ) {
    await this.commentsService.updateCommentById(id, updateParams);
  }

  @HttpCode(204)
  @Delete(':commentId')
  async deleteComment(
    @Param('commentId', ParseObjectIdPipe) id: Types.ObjectId,
  ) {
    await this.commentsService.deleteCommentById(id);
  }
}
