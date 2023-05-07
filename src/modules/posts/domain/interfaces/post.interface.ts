import { HydratedDocument, Model, Types } from 'mongoose';
import { IExtendedLikesInfo } from '../../../../modules/likes-info/domain/interfaces/likes-info.interface';
import { LikeInputModel, PostInputModel } from '../../api/models';
import { ExtendedLikesInfoViewModel } from '../../api/queryRepository/dto';
import { PostEntity } from '../entity/post.entity';
import { Post } from '../model/post.schema';
import { IPhotoSize } from '../../../../modules/blogs/domain/interfaces/blog.interface';


export interface IPostImages{
  main: IPhotoSize[];
} 
export interface IPost {
  _id?: Types.ObjectId;
  title: string;
  shortDescription: string;
  content: string;
  blogId: string;
  blogName: string;
  createdAt?: Date;
  extendedLikesInfo: IExtendedLikesInfo;
  userId: string;
  isVisible: boolean;
  images: IPostImages;
}

export interface IPostMethods {
  updatePost(updateParams: PostInputModel): void;
  updateLikeStatus(
    likeStatus: LikeInputModel,
    userId: string,
    login: string,
  ): void;
  getExtendedLikeStatus(userId?: string): ExtendedLikesInfoViewModel;
  banUser(userId: string, banned: boolean): void;
}

export type IPostEntity = IPost & IPostMethods;

export type PostDocument = HydratedDocument<Post>;

export type PostStaticType = {
  createPost: (newPost: PostEntity, PostModel: PostModelType) => PostDocument;
};

export type PostModelType = Model<PostDocument> & PostStaticType;
