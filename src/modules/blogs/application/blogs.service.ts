import { Injectable, NotFoundException } from '@nestjs/common';
import { Types } from 'mongoose';

//Repository
import { BlogsRepository } from '../infrastructure/blogs.repository';

//DTO
import { BlogPaginator, BlogViewModel } from './dto';

//Entity
import { BlogEntity } from '../domain/entity/blog.entity';

//Models
import {
  GetQueryParamsBlogDto,
  BlogInputModel,
} from '../api/models';

@Injectable()
export class BlogsService {
  constructor(
    private readonly blogsRepository: BlogsRepository,
    
  ) {}

  async createBlog(createParam: BlogInputModel): Promise<BlogViewModel> {
    const newBlog = new BlogEntity(createParam);
    return await this.blogsRepository.createBlog(newBlog);
  }

  async updateBlogById(
    id: Types.ObjectId,
    updateParam: BlogInputModel,
  ): Promise<boolean> {
    const blog = await this.getBlogById(id);
    if (!blog) {
      throw new NotFoundException();
    }
    return await this.blogsRepository.updateBlogById(id, updateParam);
  }

  async getBlogs(query?: GetQueryParamsBlogDto): Promise<BlogPaginator> {
    return await this.blogsRepository.getBlogs(query);
  }

  async getBlogById(id: Types.ObjectId): Promise<BlogViewModel> {
    const blog = await this.blogsRepository.getBlogById(id);
    console.log(blog);
    if (!blog) {
      throw new NotFoundException();
    }
    return blog;
  }

  async deleteBlogById(id: Types.ObjectId): Promise<boolean> {
    const result = await this.blogsRepository.deleteBlogById(id);
    if (!result) {
      throw new NotFoundException();
    }
    return result;
  }
}
