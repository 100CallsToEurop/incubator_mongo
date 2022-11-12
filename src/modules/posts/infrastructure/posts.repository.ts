import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { GetQueryParamsDto } from '../../../modules/paginator/dto/query-params.dto';
import { Blog } from '../../../modules/blogs/domain/model/blog.schema';
import { PostDto } from '../application/dto/post.dto';
import { PostEntity } from '../domain/entity/post.entity';
import { IPost } from '../domain/interfaces/post.interface';
import { Post } from '../domain/model/post.schema';
import { SortDirection } from '../../../modules/paginator/types/paginator.type';

@Injectable()
export class PostsRepository {
  constructor(
    @InjectModel(Blog.name) private readonly blogModel: Model<Blog>,
    @InjectModel(Post.name) private readonly postModel: Model<Post>,
  ) {}

  async getPosts(query?: GetQueryParamsDto, blogId?: string): Promise<IPost[]> {
    let filter = this.postModel.find();
    let totalCount = 10
    if (blogId) {
      const blog = await this.getGetBlog(new Types.ObjectId(blogId));
      if (!blog) {
        throw new NotFoundException();
      }
      filter.where({ blogId });
      totalCount = (await this.postModel.find(filter).exec()).length
    }
    let sort = '-createAt';
    if (query && query.sortBy && query.sortDirection) {
      query.sortDirection === SortDirection.DESC
        ? (sort = `-${query.sortBy}`)
        : `${query.sortBy}`;
    } else if (query && query.sortDirection) {
      query.sortDirection === SortDirection.DESC
        ? (sort = '-createAt')
        : (sort = 'createAt');
    } else if (query && query.sortBy) {
      sort = `-${query.sortBy}`;
    }
    const page = Number(query?.pageNumber) || 1;
    const pageSize = Number(query?.pageSize) || totalCount;
    const skip: number = (page - 1) * pageSize;

    return await this.postModel
      .find(filter)
      .skip(skip)
      .sort(sort)
      .limit(pageSize)
      .exec();
  }

  async getPostById(_id: Types.ObjectId): Promise<IPost | null> {
    return await this.postModel.findById({ _id }).exec();
  }

  async deletePostById(_id: Types.ObjectId): Promise<boolean> {
    const deletePost = await this.postModel.findByIdAndDelete({ _id }).exec();
    return deletePost ? true : false;
  }

  async createPost(post: PostEntity): Promise<IPost> {
    const blog = await this.getGetBlog(new Types.ObjectId(post.blogId));
    if (!blog) {
      throw new NotFoundException();
    }
      const newPost = new this.postModel({ ...post, blogName: blog.name });
    return await newPost.save();
  }

  async updatePost(_id: Types.ObjectId, update: PostDto): Promise<boolean> {
    const updatePost = await this.postModel
      .findByIdAndUpdate({ _id }, update)
      .exec();
    return updatePost ? true : false;
  }

  async getGetBlog(_id: Types.ObjectId) {
    return await this.blogModel.findOne({ _id }).exec();
  }
}
