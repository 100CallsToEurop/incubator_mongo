import { Types } from 'mongoose';
import { BlogInputModel } from '../../api/models/blog.model';

import { IBlog } from '../interfaces/blog.interface';

export class BlogOwnerInfoEntity {
  readonly userId: string;
  readonly userLogin: string;
}

export class BlogEntity implements IBlog {
  _id?: Types.ObjectId;
  name: string;
  websiteUrl: string;
  description: string;
  createdAt: Date;
  blogOwnerInfo: BlogOwnerInfoEntity;

  constructor(blog: BlogInputModel) {
    this._id = new Types.ObjectId();
    this.name = blog.name;
    this.websiteUrl = blog.websiteUrl;
    this.description = blog.description;
    this.createdAt = new Date();
    this.blogOwnerInfo = {
      userId: null,
      userLogin: null,
    };
  }
}
