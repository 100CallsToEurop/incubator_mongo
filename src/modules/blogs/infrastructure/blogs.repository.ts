import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';

//Interfaces
import { IBlog } from '../domain/interfaces/blog.interface';

//Schema
import { Blog } from '../domain/model/blog.schema';

//Entity
import { BlogEntity } from '../domain/entity/blog.entity';

//Models
import { GetQueryParamsBlogDto, BlogInputModel } from '../api/models';

//DTO
import { BlogPaginator, BlogViewModel } from '../application/dto';

//Sort
import { SortDirection } from '../../../modules/paginator/models/query-params.model';

@Injectable()
export class BlogsRepository {
  constructor(
    @InjectModel(Blog.name) private readonly blogModel: Model<Blog>,
  ) {}

  buildResponseBlog(blog: IBlog): BlogViewModel {
    return {
      id: blog._id.toString(),
      name: blog.name,
      youtubeUrl: blog.youtubeUrl,
      createdAt: blog.createdAt.toISOString(),
    };
  }

  async createBlog(blog: BlogEntity): Promise<BlogViewModel> {
    const newBlog = new this.blogModel(blog);
    await newBlog.save();
    return this.buildResponseBlog(newBlog);
  }

  async getBlogById(_id: Types.ObjectId): Promise<BlogViewModel | null> {
    const blog = await this.blogModel.findOne({ _id }).exec();
    return blog ? this.buildResponseBlog(blog) : null;
  }

  async getBlogs(query?: GetQueryParamsBlogDto): Promise<BlogPaginator> {
    //Filter
    let filter = this.blogModel.find();
    let totalCount = (await this.blogModel.find(filter).exec()).length;
    if (query && query.searchNameTerm) {
      filter
        .where('name')
        .regex(new RegExp('^' + query.searchNameTerm.toLowerCase(), 'i'));
      totalCount = (await this.blogModel.find(filter).exec()).length;
    }

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

    //Pagination
    const page = Number(query?.pageNumber) || 1;
    const pageSize = Number(query?.pageSize) || 10;
    const pagesCount = Math.ceil(totalCount / pageSize);
    const skip: number = (page - 1) * pageSize;

    const items = await this.blogModel
      .find(filter)
      .skip(skip)
      .sort(sort)
      .limit(pageSize)
      .exec();
    return {
      pagesCount,
      page,
      pageSize,
      totalCount,
      items: items.map((item) => this.buildResponseBlog(item)),
    };
  }

  async updateBlogById(
    _id: Types.ObjectId,
    update: BlogInputModel,
  ): Promise<boolean> {
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
