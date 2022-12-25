import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';

//Interfaces
import { BlogDocument, IBlog } from '../domain/interfaces/blog.interface';

//Schema
import { Blog } from '../domain/model/blog.schema';

//Entity
import { BlogEntity } from '../domain/entity/blog.entity';

//Models
import { BlogInputModel } from '../api/models';

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
    if (!blog) {
      throw new NotFoundException();
    }
    return blog
  }

  async deleteBlogById(blogId: string): Promise<boolean> {
    const BlogDelete = await this.blogModel
      .findOneAndDelete({ _id: new Types.ObjectId(blogId) })
      .exec();
    return BlogDelete ? true : false;
  }
}
