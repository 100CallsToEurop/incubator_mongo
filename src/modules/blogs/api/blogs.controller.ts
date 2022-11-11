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
import { ParseObjectIdPipe } from 'src/common/pipe/validation.objectid.pipe';
import { BlogsService } from '../application/blogs.service';
import { BlogDto } from '../application/dto/blog.dto';
import { BlogViewModel } from '../application/types/blog-view-model.type';
import { Types } from 'mongoose';

@Controller('blogs')
export class BlogsController {
  constructor(private readonly blogsService: BlogsService) {}

  @Get()
  async getBloggers(): Promise<BlogViewModel[]> {
    return await this.blogsService.getBlogs();
  }

  @Get(':id')
  async getBlogger(
    @Param('id', ParseObjectIdPipe) id: Types.ObjectId,
  ): Promise<BlogViewModel> {
    return await this.blogsService.getBlogById(id);
  }

  @Post()
  async createBlogger(
    @Body() createBlogParams: BlogDto,
  ): Promise<BlogViewModel> {
    console.log(1)
    return await this.blogsService.createBlog(createBlogParams);
  }

  @HttpCode(204)
  @Put(':id')
  async updateBlogger(
    @Param('id', ParseObjectIdPipe) id: Types.ObjectId,
    @Body() updateParams: BlogDto,
  ) {
    await this.blogsService.updateBlogById(id, updateParams);
  }

  @HttpCode(204)
  @Delete(':id')
  async deleteBlogger(@Param('id', ParseObjectIdPipe) id: Types.ObjectId) {
    await this.blogsService.deleteBlogById(id);
  }
}
