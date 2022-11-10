import { Types } from 'mongoose';
import { BlogDto } from '../../application/dto/blog.dto';
import { IBlog } from '../intefaces/blog.interface';

export class BlogEntity implements IBlog {
  _id?: Types.ObjectId;
  name: string;
  youtubeUrl: string;

  constructor(blog: BlogDto) {
    this._id = new Types.ObjectId();
    this.name = blog.name;
    this.youtubeUrl = blog.youtubeUrl;
  }
}
