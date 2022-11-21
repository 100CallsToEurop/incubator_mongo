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
import { LikeInputModel } from '../api/models';
import { MeViewModel } from '../../../modules/auth/application/dto';
import { IPost, LikeStatus } from '../domain/interfaces/post.interface';
@Injectable()
export class PostsService {
  constructor(private readonly postsRepository: PostsRepository) {}

  buildResponsePost(post: IPost, userId?: string): PostViewModel {
    let myStatus;

    const index_current_user = post.extendedLikesInfo.newestLikes.findIndex(
      (c) => c.userId === userId,
    );

    userId
      ? index_current_user !== -1
        ? (myStatus = post.extendedLikesInfo.newestLikes.find(
            (s) => s.userId === userId,
          ).status)
        : (myStatus = LikeStatus.NONE)
      : (myStatus = LikeStatus.NONE);

    let newestLikes = [];
    if (post.extendedLikesInfo.newestLikes.length > 3) {
      newestLikes = post.extendedLikesInfo.newestLikes.slice(-3).reverse();
    }
    else
    newestLikes = post.extendedLikesInfo.newestLikes.reverse();

    return {
      id: post._id.toString(),
      title: post.title,
      shortDescription: post.shortDescription,
      content: post.content,
      blogId: post.blogId,
      blogName: post.blogName,
      createdAt: post.createdAt.toISOString(),
      extendedLikesInfo: {
        likesCount: post.extendedLikesInfo.likesCount,
        dislikesCount: post.extendedLikesInfo.dislikesCount,
        myStatus: myStatus,
        newestLikes: newestLikes.map((n) => {
          return {
            ...n,
            addedAt: n.addedAt.toISOString(),
          };
        }),
      },
    };
  }

  async createPost(post: PostInputModel): Promise<PostViewModel> {
    const newPostEntity = new PostEntity(post);
    const blog = await this.postsRepository.getGetBlog(
      new Types.ObjectId(post.blogId),
    );
    if (!blog) {
      throw new NotFoundException();
    }
    const newPost = await this.postsRepository.createPost(
      newPostEntity,
      blog.name,
    );
    return this.buildResponsePost(newPost);
  }

  async getPosts(
    query?: PaginatorInputModel,
    blogId?: string,
    userId?: string,
  ): Promise<PostPaginator> {
    if (blogId) {
      const blog = await this.postsRepository.getGetBlog(
        new Types.ObjectId(blogId),
      );
      if (!blog) {
        throw new NotFoundException();
      }
    }
    const posts = await this.postsRepository.getPosts(query, blogId);
    return {
      ...posts,
      items: posts.items.map((item) => this.buildResponsePost(item, userId)),
    };
  }

  async getPostById(
    postId: Types.ObjectId,
    userId?: string,
  ): Promise<PostViewModel> {
    const post = await this.postsRepository.getPostById(postId);
    if (!post) {
      throw new NotFoundException();
    }
    return this.buildResponsePost(post, userId);
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

  async updateExtendedLikeStatus(
    postId: Types.ObjectId,
    likeStatus: LikeInputModel,
    user: MeViewModel,
  ) {
    await this.postsRepository.updateExtendedLikeStatus(
      postId,
      likeStatus,
      user,
    );
  }
}
