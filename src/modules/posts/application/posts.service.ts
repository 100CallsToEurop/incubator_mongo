import { Injectable, NotFoundException } from '@nestjs/common';
import { Types } from 'mongoose';

//Repository
import { PostsRepository } from '../infrastructure/posts.repository';

//Models
import { PostInputModel } from '../api/models/post.model';

//DTO
import { PostPaginator, PostViewModel } from './dto';

//Entity
import { PostEntity } from '../domain/entity/post.entity';

//QueryParams
import { PaginatorInputModel } from '../../../modules/paginator/models/query-params.model';
@Injectable()
export class PostsService {
  constructor(private readonly postsRepository: PostsRepository) {}

  async createPost(post: PostInputModel): Promise<PostViewModel> {
    const newPost = new PostEntity(post);
    const blog = await this.postsRepository.getGetBlog(
      new Types.ObjectId(post.blogId),
    );
    if (!blog) {
      throw new NotFoundException();
    }
    return await this.postsRepository.createPost(newPost, blog.name);
  }

  async getPosts(
    query?: PaginatorInputModel,
    blogId?: string,
  ): Promise<PostPaginator> {
    if (blogId) {
      const blog = await this.postsRepository.getGetBlog(
        new Types.ObjectId(blogId),
      );
      if (!blog) {
        throw new NotFoundException();
      }
    }
    return await this.postsRepository.getPosts(query, blogId);
  }

  async getPostById(postId: Types.ObjectId): Promise<PostViewModel> {
    const post = await this.postsRepository.getPostById(postId);
    if (!post) {
      throw new NotFoundException();
    }
    return post;
  }

  async deletePostById(id: Types.ObjectId): Promise<void> {
    const result = await this.postsRepository.deletePostById(id);
    if (!result) {
      throw new NotFoundException();
    }
  }
  async updatePostById(
    id: Types.ObjectId,
    updatePost: PostInputModel,
  ): Promise<boolean | null> {
    const post = await this.getPostById(id);
    if (!post) {
      throw new NotFoundException();
    }
    return await this.postsRepository.updatePost(id, updatePost);
  }
}
