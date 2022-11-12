import { Injectable, NotFoundException } from '@nestjs/common';
import { IBlog } from '../domain/intefaces/blog.interface';
import { BlogsRepository } from '../infrastructure/blogs.repository';
import { BlogDto } from './dto/blog.dto';
import { BlogPaginator, BlogViewModel } from './types/blog-view-model.type';
import { Types } from 'mongoose';
import { BlogEntity } from '../domain/entity/blog.entity';
import { PostsService } from '../../../modules/posts/application/posts.service';
import { BlogPostDto } from './dto/blog-post.dto';
import {
  PostPaginator,
  PostViewModel,
} from '../../../modules/posts/application/types/post-view-model';
import { GetQueryParamsBlogDto } from '../api/model/blog-query.dto';
import { GetQueryParamsDto } from '../../../modules/paginator/dto/query-params.dto';

@Injectable()
export class BlogsService {
  constructor(
    private readonly blogsRepository: BlogsRepository,
    private readonly postsService: PostsService,
  ) {}

  buildResponseBlog(blog: IBlog): BlogViewModel {
    return {
      id: blog._id.toString(),
      name: blog.name,
      youtubeUrl: blog.youtubeUrl,
      createdAt: blog.createdAt.toISOString(),
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

  async getBlogs(query?: GetQueryParamsBlogDto): Promise<BlogPaginator> {
    const [items, totalCount] = await this.blogsRepository.getBlogs(query);
    const page = Number(query?.pageNumber) || 1;
    const pageSize = Number(query?.pageSize) || 10;
    const pagesCount = Math.ceil(totalCount / pageSize);
    return {
      pagesCount,
      page,
      pageSize,
      totalCount,
      items: items.map((item) => this.buildResponseBlog(item)),
    };
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

  async createPostBlog(
    blogId: string,
    createPostParams: BlogPostDto,
  ): Promise<PostViewModel> {
    const postDto = { ...createPostParams, blogId };
    return await this.postsService.createPost(postDto);
  }

  async getPostsBlog(
    blogId: string,
    query?: GetQueryParamsDto,
  ): Promise<PostPaginator> {
    return await this.postsService.getPosts(query, blogId);
  }
}
