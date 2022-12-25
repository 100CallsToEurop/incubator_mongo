import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Paginated } from 'src/modules/paginator/models/paginator';
import { SortDirection } from '../../../../modules/paginator/models/query-params.model';
import { BlogViewModel } from './dto';
import { BlogDocument } from '../../domain/interfaces/blog.interface';
import { Blog } from '../../domain/model/blog.schema';
import { GetQueryParamsBlogDto } from '../models';

@Injectable()
export class BlogsQueryRepository {
  constructor(
    @InjectModel(Blog.name) private readonly blogModel: Model<BlogDocument>,
  ) {}

  buildResponseBlog(blog: BlogDocument): BlogViewModel {
    return {
      id: blog._id.toString(),
      name: blog.getName(),
      description: blog.getDescription(),
      websiteUrl: blog.getWebsiteUrl(),
      createdAt: blog.getCreatedAt().toISOString(),
    };
  }

  async getBlogById(blogId: string): Promise<BlogViewModel> {
    const blog = await this.blogModel
      .findOne({ _id: new Types.ObjectId(blogId) })
      .exec();
    if (!blog) {
      throw new NotFoundException();
    }
    return this.buildResponseBlog(blog);
  }

  async getBlogs(
    query?: GetQueryParamsBlogDto,
  ): Promise<Paginated<BlogViewModel[]>> {
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

    let filter = this.blogModel.find();
    if (query && query.searchNameTerm) {
      filter
        .where('name')
        .regex(new RegExp('^' + query.searchNameTerm.toLowerCase(), 'i'));
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
}
