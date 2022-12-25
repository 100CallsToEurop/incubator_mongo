import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';

//Interfaces
import { BlogDocument } from '../domain/interfaces/blog.interface';

//Schema
import { Blog } from '../domain/model/blog.schema';

@Injectable()
export class BlogsRepository {
  constructor(
    @InjectModel(Blog.name) private readonly blogModel: Model<BlogDocument>,
  ) {}

  async save(model: BlogDocument) {
    return await model.save();
  }

  async getBlogById(blogId: string): Promise<BlogDocument> {
    const blog = await this.blogModel
      .findOne({ _id: new Types.ObjectId(blogId) })
      .exec();
    return blog;
  }

  async deleteBlogById(blogId: string): Promise<boolean> {
    const BlogDelete = await this.blogModel
      .findOneAndDelete({ _id: new Types.ObjectId(blogId) })
      .exec();
    return BlogDelete ? true : false;
  }
}
