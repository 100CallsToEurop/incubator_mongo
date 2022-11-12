import { Types } from 'mongoose';
import { BlogDto } from '../../application/dto/blog.dto';
import { IBlog } from '../intefaces/blog.interface';

export class BlogEntity implements IBlog {
  _id?: Types.ObjectId;
  name: string;
  youtubeUrl: string;
  createdAt: Date

  constructor(blog: BlogDto) {
    this._id = new Types.ObjectId();
    this.name = blog.name;
    this.youtubeUrl = blog.youtubeUrl;
    this.createdAt = new Date()
  }
}
