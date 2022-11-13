import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BlogDto } from '../application/dto/blog.dto';
import { IBlog } from '../domain/intefaces/blog.interface';
import { Blog } from '../domain/model/blog.schema';
import { Types } from 'mongoose';
import { BlogEntity } from '../domain/entity/blog.entity';
import { GetQueryParamsBlogDto } from '../api/model/blog-query.dto';
import { SortDirection } from 'src/modules/paginator/types/paginator.type';

@Injectable()
export class BlogsRepository {
  constructor(
    @InjectModel(Blog.name) private readonly blogModel: Model<Blog>,
  ) {}

  async createBlog(blogger: BlogEntity): Promise<IBlog> {
    const newBlogger = new this.blogModel(blogger);
    return await newBlogger.save();
  }

  async getBlogById(_id: Types.ObjectId): Promise<IBlog> {
    return await this.blogModel.findOne({ _id }).exec();
  }

  async getBlogs(query?: GetQueryParamsBlogDto): Promise<[IBlog[], number]> {
    let filter = this.blogModel.find();
    let totalCount = (await this.blogModel.find(filter).exec()).length;
    if (query && query.searchNameTerm) {
      filter.where('name').regex(query.searchNameTerm);
      totalCount = (await this.blogModel.find(filter).exec()).length;
    }

    let sort = '-createdAt';
    if (query && query.sortBy && query.sortDirection) {
      query.sortDirection === SortDirection.DESC
        ? (sort = `-${query.sortBy}`)
        : (sort = `${query.sortBy}`);
    } else if (query && query.sortDirection) {
      query.sortDirection === SortDirection.DESC
        ? (sort = '-createdAt')
        : (sort = 'createdAt');
    } else if (query && query.sortBy) {
      sort = `-${query.sortBy}`;
    }
    const page = Number(query?.pageNumber) ||  1;
    const pageSize = Number(query?.pageSize) || 10;
    const skip: number = (page - 1) * pageSize;

    const items = await this.blogModel
      .find(filter)
      .skip(skip)
      .sort(sort)
      .limit(pageSize)
      .exec();
      return [items, totalCount];
  }

  async updateBlogById(_id: Types.ObjectId, update: BlogDto): Promise<boolean> {
    const BlogUpdate = await this.blogModel
      .findOneAndUpdate({ _id }, update)
      .exec();
    return BlogUpdate ? true : false;
  }

  async deleteBlogById(_id: Types.ObjectId): Promise<boolean> {
    const BlogDelete = await this.blogModel.findOneAndDelete({ _id }).exec();
    return BlogDelete ? true : false;
  }
}
