import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BlogDto } from '../application/dto/blog.dto';
import { IBlog } from '../domain/intefaces/blog.interface';
import { Blog } from '../domain/model/blog.schema';
import { Types } from 'mongoose';
import { BlogEntity } from '../domain/entity/blog.entity';

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

  async getBlogs(): Promise<IBlog[]> {
    return await this.blogModel.find().exec();
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
