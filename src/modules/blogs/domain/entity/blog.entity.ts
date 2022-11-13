import { Types } from 'mongoose';
import { BlogInputModel } from '../../api/models/blog.model';

import { IBlog } from '../interfaces/blog.interface';

export class BlogEntity implements IBlog {
  _id?: Types.ObjectId;
  name: string;
  youtubeUrl: string;
  createdAt: Date;

  constructor(blog: BlogInputModel) {
    this._id = new Types.ObjectId();
    this.name = blog.name;
    this.youtubeUrl = blog.youtubeUrl;
    this.createdAt = new Date();
  }
}
