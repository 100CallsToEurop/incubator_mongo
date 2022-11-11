import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { ParseObjectIdPipe } from 'src/common/pipe/validation.objectid.pipe';
import { BlogsService } from '../application/blogs.service';
import { BlogDto } from '../application/dto/blog.dto';
import { BlogViewModel } from '../application/types/blog-view-model.type';
import { Types } from 'mongoose';
import { BasicAuthGuard } from 'src/common/guards/basic-auth.guard';

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

  @UseGuards(BasicAuthGuard)
  @Post()
  async createBlogger(
    @Body() createBlogParams: BlogDto,
  ): Promise<BlogViewModel> {
    return await this.blogsService.createBlog(createBlogParams);
  }

  @UseGuards(BasicAuthGuard)
  @HttpCode(204)
  @Put(':id')
  async updateBlogger(
    @Param('id', ParseObjectIdPipe) id: Types.ObjectId,
    @Body() updateParams: BlogDto,
  ) {
    await this.blogsService.updateBlogById(id, updateParams);
  }

  @UseGuards(BasicAuthGuard)
  @HttpCode(204)
  @Delete(':id')
  async deleteBlogger(@Param('id', ParseObjectIdPipe) id: Types.ObjectId) {
    await this.blogsService.deleteBlogById(id);
  }
}
