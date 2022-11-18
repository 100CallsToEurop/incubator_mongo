import { Injectable, NotFoundException } from '@nestjs/common';
import { Types } from 'mongoose';

//Repository
import { BlogsRepository } from '../infrastructure/blogs.repository';

//DTO
import { BlogPaginator, BlogViewModel } from './dto';

//Entity
import { BlogEntity } from '../domain/entity/blog.entity';

//Models
import { GetQueryParamsBlogDto, BlogInputModel } from '../api/models';
import { IBlog } from '../domain/interfaces/blog.interface';

@Injectable()
export class BlogsService {
  constructor(private readonly blogsRepository: BlogsRepository) {}

  buildResponseBlog(blog: IBlog): BlogViewModel {
    return {
      id: blog._id.toString(),
      name: blog.name,
      description: blog.description,
      websiteUrl: blog.websiteUrl,
      createdAt: blog.createdAt.toISOString(),
    };
  }

  async createBlog(createParam: BlogInputModel): Promise<BlogViewModel> {
    const newBlogEntity = new BlogEntity(createParam);
    const newBlog = await this.blogsRepository.createBlog(newBlogEntity);
    return this.buildResponseBlog(newBlog);
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
    const blogs = await this.blogsRepository.getBlogs(query);
    return {
      ...blogs,
      items: blogs.items.map((item) => this.buildResponseBlog(item)),
    };
  }

  async getBlogById(id: Types.ObjectId): Promise<BlogViewModel> {
    const blog = await this.blogsRepository.getBlogById(id);
    if (!blog) {
      throw new NotFoundException();
    }
    return this.buildResponseBlog(blog);
  }

  async deleteBlogById(id: Types.ObjectId): Promise<boolean> {
    const result = await this.blogsRepository.deleteBlogById(id);
    if (!result) {
      throw new NotFoundException();
    }
    return result;
  }
}
