import { Types } from 'mongoose';
import { IExtendedLikesInfo, LikeStatus } from '../../../../modules/likes-info/domain/interfaces/likes-info.interface';
import { PostInputModel } from '../../api/models/post.model';
import { IPost} from '../interfaces/post.interface';
import { PhotoSizeEntity } from '../../../../modules/blogs/domain/entity/blog.entity';


export class PostImagesEntity {
  main: PhotoSizeEntity[];
} 

export class PostEntity implements IPost {
  _id?: Types.ObjectId;
  title: string;
  shortDescription: string;
  content: string;
  blogId: string;
  blogName: string;
  createdAt: Date;
  extendedLikesInfo: IExtendedLikesInfo;
  userId: string;
  isVisible: boolean;
  images: PostImagesEntity;

  constructor(post: PostInputModel, blogName: string, userId?: string) {
    this._id = new Types.ObjectId();
    this.title = post.title;
    this.shortDescription = post.shortDescription;
    this.content = post.content;
    this.blogId = post.blogId;
    this.blogName = blogName;
    this.createdAt = new Date();
    this.extendedLikesInfo = {
      likesCount: 0,
      dislikesCount: 0,
      myStatus: LikeStatus.NONE,
      newestLikes: [],
    };
    (this.isVisible = true), (this.userId = userId ? userId : null);
    this.images.main = []
  }
}
