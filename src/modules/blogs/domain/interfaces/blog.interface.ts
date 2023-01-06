import { HydratedDocument, Model, Types } from 'mongoose';
import { BlogInputModel } from '../../api/models';
import { BlogEntity } from '../entity/blog.entity';
import { Blog } from '../model/blog.schema';

export interface IBlogBindWith{
  userId: string
  userLogin: string
}

export interface IBanInfoBlog {
  isBanned: boolean;
  banDate: Date;
}

export interface IBlog {
  _id?: Types.ObjectId;
  name: string;
  description: string;
  websiteUrl: string;
  createdAt?: Date;
  blogOwnerInfo: IBlogBindWith;
}

export interface IBlogMethods {
  updateBlog(updateParams: BlogInputModel): void;
}

export type IBlogEntity = IBlog & IBlogMethods;


export type BlogDocument = HydratedDocument<Blog>;

export type BlogStaticType = {
  createBlog : (
    newBlog: BlogEntity,
    BlogModel: BlogModelType,
  ) => BlogDocument;
};

export type BlogModelType = Model<BlogDocument> &
  BlogStaticType;
