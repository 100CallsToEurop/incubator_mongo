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
import { PostsService } from '../application/posts.service';
import { Types } from 'mongoose';
import {
  PostPaginator,
  PostViewModel,
} from '../application/types/post-view-model';
import { ParseObjectIdPipe } from '../../../common/pipe/validation.objectid.pipe';
import { PostDto } from '../application/dto/post.dto';
import { BasicAuthGuard } from '../../../common/guards/basic-auth.guard';
import { GetQueryParamsDto } from '../../../modules/paginator/dto/query-params.dto';

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Get()
  async getPosts(@Query() query?: GetQueryParamsDto): Promise<PostPaginator> {
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
  async createPost(@Body() createPostParams: PostDto): Promise<PostViewModel> {
    return await this.postsService.createPost(createPostParams);
  }

  @UseGuards(BasicAuthGuard)
  @HttpCode(204)
  @Put(':id')
  async updatePost(
    @Param('id', ParseObjectIdPipe) id: Types.ObjectId,
    @Body() updatePostParams: PostDto,
  ) {
    await this.postsService.updatePostById(id, updatePostParams);
  }
}
