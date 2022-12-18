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
import { BlogInputModel } from '../api/models';

@Injectable()
export class BlogsRepository {
  constructor(
    @InjectModel(Blog.name) private readonly blogModel: Model<Blog>,
  ) {}

  async createBlog(blog: BlogEntity): Promise<string> {
    const newBlog = new this.blogModel(blog);
    await newBlog.save();
    return newBlog._id.toString()
  }

  async updateBlogById(
    blogId: string,
    update: BlogInputModel,
  ): Promise<boolean> {
    const BlogUpdate = await this.blogModel
      .findOneAndUpdate({ _id: new Types.ObjectId(blogId) }, update)
      .exec();
    return BlogUpdate ? true : false;
  }

  async deleteBlogById(blogId: string): Promise<boolean> {
    const BlogDelete = await this.blogModel
      .findOneAndDelete({ _id: new Types.ObjectId(blogId) })
      .exec();
    return BlogDelete ? true : false;
  }
}
