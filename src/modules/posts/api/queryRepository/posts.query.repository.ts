import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Blog } from '../../../../modules/blogs/domain/model/blog.schema';
import { Paginated } from '../../../../modules/paginator/models/paginator';
import {
  PaginatorInputModel,
  SortDirection,
} from '../../../../modules/paginator/models/query-params.model';
import { PostViewModel } from './dto';
import { Post } from '../../domain/model/post.schema';
import { PostDocument } from '../../domain/interfaces/post.interface';
import { BlogDocument } from '../../../../modules/blogs/domain/interfaces/blog.interface';

@Injectable()
export class PostsQueryRepository {
  constructor(
    @InjectModel(Blog.name) private readonly blogModel: Model<BlogDocument>,
    @InjectModel(Post.name) private readonly postModel: Model<PostDocument>,
  ) {}

  buildResponsePost(post: PostDocument, userId?: string): PostViewModel {
    return {
      id: post._id.toString(),
      title: post.title,
      shortDescription: post.shortDescription,
      content: post.content,
      blogId: post.blogId,
      blogName: post.blogName,
      createdAt: post.createdAt.toISOString(),
      extendedLikesInfo: post.getExtendedLikeStatus(userId),
    };
  }

  async getBlogById(blogId: string) {
    return await this.blogModel
      .findOne({ _id: new Types.ObjectId(blogId) })
      .exec();
  }

  async getPostById(postId: string, userId?: string): Promise<PostViewModel> {
    const post = await this.postModel
      .findOne({ _id: new Types.ObjectId(postId), isVisible: true })
      .exec();
    if (!post) {
      return null;
    }
    return this.buildResponsePost(post, userId);
  }

  async getPosts(
    query?: PaginatorInputModel,
    blogId?: string,
    userId?: string,
  ): Promise<Paginated<PostViewModel[]>> {
    //Sort
    const sortDefault = 'createdAt';
    let sort = `-${sortDefault}`;
    if (query && query.sortBy && query.sortDirection) {
      query.sortDirection === SortDirection.DESC
        ? (sort = `-${query.sortBy}`)
        : (sort = `${query.sortBy}`);
    } else if (query && query.sortDirection) {
      query.sortDirection === SortDirection.DESC
        ? (sort = `-${sortDefault}`)
        : (sort = sortDefault);
    } else if (query && query.sortBy) {
      sort = `-${query.sortBy}`;
    }

    //Filter
    let filter = this.postModel.find({ isVisible: true });
    if (blogId) {
      filter.where({ blogId });
    }

    //Pagination
    const page = Number(query?.pageNumber) || 1;
    const size = Number(query?.pageSize) || 10;
    const skip: number = (page - 1) * size;
    const totalCountPosts = await this.postModel.count(filter);

    const posts = await this.postModel
      .find(filter)
      .skip(skip)
      .sort(sort)
      .limit(size)
      .exec();

    const paginatedPosts = Paginated.getPaginated<PostViewModel[]>({
      items: posts.map((post) => this.buildResponsePost(post, userId)),
      page: page,
      size: size,
      count: totalCountPosts,
    });

    return paginatedPosts;
  }
}
