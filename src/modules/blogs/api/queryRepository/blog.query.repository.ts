import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Paginated } from '../../../../modules/paginator/models/paginator';
import { PaginatorInputModel } from '../../../../modules/paginator/models/query-params.model';
import { BlogViewModel, BlogViewModelForSA } from './dto';
import { BlogDocument } from '../../domain/interfaces/blog.interface';
import { Blog } from '../../domain/model/blog.schema';
import { GetQueryParamsBlogDto, GetQueryParamsBlogUserDto } from '../models';
import { sortUtils } from '../../../../utils/sort';
import { BloggerCommentViewModel } from './dto/comments-view-model';
import { CommentDocument } from '../../../../modules/comments/domain/interfaces/comment.interface';
import { Post } from '../../../../modules/posts/domain/model/post.schema';
import { PostDocument } from '../../../../modules/posts/domain/interfaces/post.interface';
import { Comments } from '../../../../modules/comments/domain/model/comment.schema';

@Injectable()
export class BlogsQueryRepository {
  constructor(
    @InjectModel(Blog.name) private readonly blogModel: Model<BlogDocument>,
    @InjectModel(Post.name) private readonly postModel: Model<PostDocument>,
    @InjectModel(Comments.name)
    private readonly commentsModel: Model<CommentDocument>,
  ) {}

  private createRegExp(value: string): RegExp {
    return new RegExp('^' + value.toLowerCase(), 'i');
  }

  buildResponseBlog(blog: BlogDocument): BlogViewModel {
    return {
      id: blog._id.toString(),
      name: blog.getName(),
      description: blog.getDescription(),
      websiteUrl: blog.getWebsiteUrl(),
      createdAt: blog.getCreatedAt().toISOString(),
    };
  }

  buildResponseBlogForSA(blog: BlogDocument): BlogViewModelForSA {
    console.log(blog)
    const { userId, userLogin } = blog.getBlogOwnerInfo();
    const { isBanned, banDate } = blog.getBanInfo();
    return {
      id: blog._id.toString(),
      name: blog.getName(),
      description: blog.getDescription(),
      websiteUrl: blog.getWebsiteUrl(),
      createdAt: blog.getCreatedAt().toISOString(),
      blogOwnerInfo: {
        userId,
        userLogin,
      },
      banInfo: { isBanned, banDate: banDate.toISOString() },
    };
  }

  async buildResponseAllCommentsPost(
    comments: CommentDocument,
    userId: string,
  ): Promise<BloggerCommentViewModel> {
    const cuurrentCommentPostId = comments.getPostId();
    const post = await this.postModel.findOne(
      new Types.ObjectId(cuurrentCommentPostId),
    );
    return {
      id: comments._id.toString(),
      content: comments.getContent(),
      createdAt: comments.getCreatedAt().toISOString(),
      likesInfo: comments.getLikeStatus(userId),
      commentatorInfo: {
        userId: comments.getUserId(),
        userLogin: comments.getUserLogin(),
      },
      postInfo: {
        id: post._id.toString(),
        title: post.getTitle(),
        blogId: post.getBlogId(),
        blogName: post.getBlogName(),
      },
    };
  }

  async getBlogById(blogId: string): Promise<BlogViewModel> {
    const blog = await this.blogModel
      .findOne({ _id: new Types.ObjectId(blogId) })
      .exec();
    if (!blog) {
      return null;
    }
    return this.buildResponseBlog(blog);
  }

  async getBlogs(
    query?: GetQueryParamsBlogDto,
    userId?: string,
  ): Promise<Paginated<BlogViewModel[]>> {
    const sort = sortUtils(query.sortBy, query.sortDirection);
    const whereCondition = [];

    if (query && query.searchNameTerm) {
      whereCondition.push({
        name: this.createRegExp(query.searchNameTerm),
      });
    }

    if (userId) {
      whereCondition.push({
        'blogOwnerInfo.userId': userId,
      });
    }

    let filter = this.blogModel.find();
    if (whereCondition.length > 0) {
      filter.and(whereCondition);
    }

    //Pagination
    const page = Number(query?.pageNumber) || 1;
    const size = Number(query?.pageSize) || 10;
    const skip: number = (page - 1) * size;
    const totalCountBlogs = await this.blogModel.count(filter);

    const blogs = await this.blogModel
      .find(filter)
      .skip(skip)
      .sort(sort)
      .limit(size)
      .exec();

    const paginatedUsers = Paginated.getPaginated<BlogViewModel[]>({
      items: blogs.map((blog) => this.buildResponseBlog(blog)),
      page: page,
      size: size,
      count: totalCountBlogs,
    });

    return paginatedUsers;
  }

  async getBlogsForSA(
    query?: GetQueryParamsBlogDto,
    userId?: string,
  ): Promise<Paginated<BlogViewModelForSA[]>> {
    //Sort
    const sort = sortUtils(query.sortBy, query.sortDirection);

    const whereCondition = [];

    if (query && query.searchNameTerm) {
      whereCondition.push({
        name: this.createRegExp(query.searchNameTerm),
      });
    }

    if (userId) {
      whereCondition.push({
        'blogOwnerInfo.userId': userId,
      });
    }

    let filter = this.blogModel.find();
    if (whereCondition.length > 0) {
      filter.or(whereCondition);
    }

    //Pagination
    const page = Number(query?.pageNumber) || 1;
    const size = Number(query?.pageSize) || 10;
    const skip: number = (page - 1) * size;
    const totalCountBlogs = await this.blogModel.count(filter);

    const blogs = await this.blogModel
      .find(filter)
      .skip(skip)
      .sort(sort)
      .limit(size)
      .exec();

    const paginatedUsers = Paginated.getPaginated<BlogViewModelForSA[]>({
      items: blogs.map((blog) => this.buildResponseBlogForSA(blog)),
      page: page,
      size: size,
      count: totalCountBlogs,
    });

    return paginatedUsers;
  }

  async getAllPostComments(
    userId: string,
    query?: PaginatorInputModel,
  ): Promise<Paginated<Promise<BloggerCommentViewModel>[]>> {
    const posts = await this.postModel.find({ userId });
    const postIds = posts.map((post) => post._id.toString());

    const sort = sortUtils(query.sortBy, query.sortDirection);

    const whereCondition = [];

    if (userId) {
      whereCondition.push({
        postId: { $in: postIds },
      });
    }

    let filter = this.commentsModel.find();
    if (whereCondition.length > 0) {
      filter.or(whereCondition);
    }

    //Pagination
    const page = Number(query?.pageNumber) || 1;
    const size = Number(query?.pageSize) || 10;
    const skip: number = (page - 1) * size;
    const totalCountComents = await this.commentsModel.count(filter);

    const comments = await this.commentsModel
      .find(filter)
      .skip(skip)
      .sort(sort)
      .limit(size)
      .exec();

    const paginatedUsers = Paginated.getPaginated<
      Promise<BloggerCommentViewModel>[]
    >({
      items: comments.map(
        async (comment) =>
          await this.buildResponseAllCommentsPost(comment, userId),
      ),
      page: page,
      size: size,
      count: totalCountComents,
    });

    return paginatedUsers;
  }
}
