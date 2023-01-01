import { Types } from 'mongoose';
import { MeViewModel } from '../../../../modules/auth/application/dto';
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

  constructor(blog: BlogInputModel, user: MeViewModel) {
    this._id = new Types.ObjectId();
    this.name = blog.name;
    this.websiteUrl = blog.websiteUrl;
    this.description = blog.description;
    this.createdAt = new Date();
    this.blogOwnerInfo = {
      userId: user ? user.userId : null,
      userLogin: user ? user.login : null,
    };
  }
}
