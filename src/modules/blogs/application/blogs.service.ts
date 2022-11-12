import { Injectable, NotFoundException } from '@nestjs/common';
import { IBlog } from '../domain/intefaces/blog.interface';
import { BlogsRepository } from '../infrastructure/blogs.repository';
import { BlogDto } from './dto/blog.dto';
import { BlogViewModel } from './types/blog-view-model.type';
import { Types } from 'mongoose';
import { BlogEntity } from '../domain/entity/blog.entity';

@Injectable()
export class BlogsService {
  constructor(private readonly blogsRepository: BlogsRepository) {}

  buildResponseBlog(blog: IBlog): BlogViewModel {
    return {
      id: blog._id.toString(),
      name: blog.name,
      youtubeUrl: blog.youtubeUrl,
      createdAt: blog.createdAt.toISOString()
    };
  }

  async createBlog(createParam: BlogDto): Promise<BlogViewModel> {
    const newBlog = new BlogEntity(createParam);
    await this.blogsRepository.createBlog(newBlog);
    return this.buildResponseBlog(newBlog);
  }

  async updateBlogById(
    id: Types.ObjectId,
    updateParam: BlogDto,
  ): Promise<boolean> {
    const blog = await this.getBlogById(id);
    if (!blog) {
      throw new NotFoundException();
    }
    return await this.blogsRepository.updateBlogById(id, updateParam);
  }

  async getBlogs(): Promise<BlogViewModel[]> {
    const blogs = await this.blogsRepository.getBlogs();
    return blogs.map((b) => this.buildResponseBlog(b));
  }
  async getBlogById(id: Types.ObjectId): Promise<BlogViewModel | null> {
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
