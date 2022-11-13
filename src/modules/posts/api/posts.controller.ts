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
import { PostsService } from '../application/posts.service';

//DTO
import {
  PostPaginator,
  PostViewModel,
} from '../application/dto';

//Pipe
import { ParseObjectIdPipe } from '../../../common/pipe/validation.objectid.pipe';

//Models
import { PostInputModel } from './models';

//Guards
import { BasicAuthGuard } from '../../../common/guards/basic-auth.guard';

//QueryParams
import { PaginatorInputModel } from '../../paginator/models/query-params.model';

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Get()
  async getPosts(@Query() query?: PaginatorInputModel): Promise<PostPaginator> {
    return await this.postsService.getPosts(query);
  }

  @Get(':id')
  async getPost(
    @Param('id', ParseObjectIdPipe) id: Types.ObjectId,
  ): Promise<PostViewModel> {
    return await this.postsService.getPostById(id);
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
}
