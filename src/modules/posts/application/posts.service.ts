import { Injectable, NotFoundException } from '@nestjs/common';
import { IPost } from '../domain/interfaces/post.interface';
import { PostsRepository } from '../infrastructure/posts.repository';
import { PostDto } from './dto/post.dto';
import { PostPaginator, PostViewModel } from './types/post-view-model';
import { Types } from 'mongoose';
import { PostEntity } from '../domain/entity/post.entity';
import { GetQueryParamsDto } from 'src/modules/paginator/dto/query-params.dto';
@Injectable()
export class PostsService {
  constructor(private readonly postsRepository: PostsRepository) {}

  buildResponsePost(post: IPost): PostViewModel {
    return {
      id: post._id.toString(),
      title: post.title,
      shortDescription: post.shortDescription,
      content: post.content,
      blogId: post.blogId,
      blogName: post.blogName,
      createdAt: post.createdAt.toISOString(),
    };
  }

  async createPost(post: PostDto): Promise<PostViewModel> {
    const newPost = new PostEntity(post);
    const result = await this.postsRepository.createPost(newPost);
    return await this.buildResponsePost(result);
  }

  async getPosts(query?: GetQueryParamsDto, blogId?: string): Promise<PostPaginator> {
    const [items, totalCount] = await this.postsRepository.getPosts(
      query,
      blogId,
    );
    const page = Number(query?.pageNumber) || 1;
    const pageSize = Number(query?.pageSize) || 10;
    const pagesCount = Math.ceil(totalCount / pageSize);
    return {
      pagesCount,
      page,
      pageSize,
      totalCount,
      items: items.map((item) => this.buildResponsePost(item)),
    };
  }

  async getPostById(postId: Types.ObjectId): Promise<PostViewModel> {
    const post = await this.postsRepository.getPostById(postId);
    if (!post) {
      throw new NotFoundException();
    }
    return await this.buildResponsePost(post);
  }

  async deletePostById(id: Types.ObjectId): Promise<void> {
    const result = await this.postsRepository.deletePostById(id);
    if (!result) {
      throw new NotFoundException();
    }
  }
  async updatePostById(
    id: Types.ObjectId,
    updatePost: PostDto,
  ): Promise<boolean | null> {
    const post = await this.getPostById(id);
    if (!post) {
      throw new NotFoundException();
    }
    return await this.postsRepository.updatePost(id, updatePost);
  }
}
