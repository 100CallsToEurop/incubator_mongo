import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { PostsService } from '../application/posts.service';
import { Types } from 'mongoose';
import { PostViewModel } from '../application/types/post-view-model';
import { ParseObjectIdPipe } from '../../../common/pipe/validation.objectid.pipe';
import { PostDto } from '../application/dto/post.dto';

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Get()
  async getPosts(): Promise<PostViewModel[]> {
    return await this.postsService.getPosts();
  }

  @Get(':id')
  async getPost(
    @Param('id', ParseObjectIdPipe) id: Types.ObjectId,
  ): Promise<PostViewModel> {
    return await this.postsService.getPostById(id);
  }

  @HttpCode(204)
  @Delete(':id')
  async deletePost(
    @Param('id', ParseObjectIdPipe) id: Types.ObjectId,
  ): Promise<void> {
    await this.postsService.deletePostById(id);
  }

  @Post()
  async createPost(@Body() createPostParams: PostDto): Promise<PostViewModel> {
    return await this.postsService.createPost(createPostParams);
  }
  @HttpCode(204)
  @Put(':id')
  async updatePost(
    @Param('id', ParseObjectIdPipe) id: Types.ObjectId,
    @Body() updatePostParams: PostDto,
  ) {
    await this.postsService.updatePostById(id, updatePostParams);
  }
}
