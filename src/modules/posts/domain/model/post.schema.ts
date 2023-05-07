import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { IUserInfoInputModel } from '../../../../modules/likes-info/domain/interfaces/newest-like.interface';
import { IExtendedLikesInfoEntity } from '../../../../modules/likes-info/domain/interfaces/likes-info.interface';
import { LikeInfoSchema } from '../../../../modules/likes-info/domain/schema/like-info.schema';
import { LikeInputModel, PostInputModel } from '../../api/models';
import { PostEntity } from '../entity/post.entity';
import {
  IPostEntity,
  IPostImages,
  PostDocument,
  PostModelType,
  PostStaticType,
} from '../interfaces/post.interface';
import { ExtendedLikesInfoViewModel } from '../../api/queryRepository/dto';
import { IPhotoSize } from '../../../../modules/blogs/domain/interfaces/blog.interface';
import { PhotoSizeSchema } from '../../../../modules/blogs/domain/model/blog.schema';
@Schema({ collection: 'posts-images' })
export class PostImages {
  @Prop({ required: false, type: [PhotoSizeSchema] })
  main: IPhotoSize[];
}

export const PostImagesSchema = SchemaFactory.createForClass(PostImages);

@Schema({ collection: 'posts' })
export class Post extends Document implements IPostEntity {
  @Prop({ required: true, type: String })
  title: string;
  @Prop({ required: true, type: String })
  shortDescription: string;
  @Prop({ required: true, type: String })
  content: string;
  @Prop({ required: true, type: String })
  blogId: string;
  @Prop({ required: true, type: String })
  blogName: string;
  @Prop({ type: Date, timestamps: true })
  createdAt: Date;
  @Prop({ required: true, type: LikeInfoSchema })
  extendedLikesInfo: IExtendedLikesInfoEntity;
  @Prop({ required: false, type: String })
  userId: string;
  @Prop({ required: true, type: Boolean, default: true })
  isVisible: boolean;
  @Prop({ required: false, type: [PostImagesSchema] })
  images: IPostImages;

  public setTitle(title: string): void {
    this.title = title;
  }
  public setShortDescription(shortDescription: string): void {
    this.shortDescription = shortDescription;
  }
  public setContent(content: string): void {
    this.content = content;
  }
  public setBlogId(blogId: string): void {
    this.blogId = blogId;
  }
  public setBlogName(blogName: string): void {
    this.blogName = blogName;
  }

  public getTitle(): string {
    return this.title;
  }
  public getShortDescription(): string {
    return this.shortDescription;
  }
  public getContent(): string {
    return this.content;
  }
  public getBlogId(): string {
    return this.blogId;
  }
  public getBlogName(): string {
    return this.blogName;
  }

  public getUserId(): string {
    return this.userId;
  }

  public updatePost(updateParams: PostInputModel): void {
    this.setTitle(updateParams.title);
    this.setShortDescription(updateParams.shortDescription);
    this.setContent(updateParams.content);
    this.setBlogId(updateParams.blogId);
  }

  public checkOwnerPost(userId?: string) {
    const ownerUserId = this.getUserId();
    if (ownerUserId !== userId) return true;
    return false;
  }

  public getExtendedLikeStatus(userId?: string): ExtendedLikesInfoViewModel {
    const likesInfo = this.extendedLikesInfo.getExtendedLikeStatus(userId);

    const newestLikes = likesInfo.newestLikes
      .filter((likeInfo) => !likeInfo.isBanned)
      .map((likeInfo) => {
        return {
          addedAt: likeInfo.addedAt.toISOString(),
          userId: likeInfo.userId,
          login: likeInfo.login,
        };
      });

    return {
      likesCount: likesInfo.likesCount,
      dislikesCount: likesInfo.dislikesCount,
      myStatus: likesInfo.myStatus,
      newestLikes,
    };
  }

  public updateLikeStatus(
    { likeStatus }: LikeInputModel,
    userId: string,
    login: string,
  ): void {
    const updateParams: IUserInfoInputModel = {
      likeStatus,
      userId,
      login,
    };
    this.extendedLikesInfo.updateLikeStatus(updateParams);
  }

  public banUser(userId: string, banned: boolean): void {
    this.extendedLikesInfo.ban(userId, banned);
  }

  public static createPost(
    newPostEntity: PostEntity,
    PostModel: PostModelType,
  ): PostDocument {
    const newPost = new PostModel(newPostEntity);
    return newPost;
  }
}

export const PostSchema = SchemaFactory.createForClass(Post);

const postStaticMethod: PostStaticType = {
  createPost: Post.createPost,
};
PostSchema.statics = postStaticMethod;

PostSchema.methods.setTitle = Post.prototype.setTitle;
PostSchema.methods.setShortDescription = Post.prototype.setShortDescription;
PostSchema.methods.setContent = Post.prototype.setContent;
PostSchema.methods.setBlogId = Post.prototype.setBlogId;
PostSchema.methods.setBlogName = Post.prototype.setBlogName;

PostSchema.methods.getTitle = Post.prototype.getTitle;
PostSchema.methods.getShortDescription = Post.prototype.getShortDescription;
PostSchema.methods.getContent = Post.prototype.getContent;
PostSchema.methods.getBlogId = Post.prototype.getBlogId;
PostSchema.methods.getUserId = Post.prototype.getUserId;

PostSchema.methods.updatePost = Post.prototype.updatePost;
PostSchema.methods.updateLikeStatus = Post.prototype.updateLikeStatus;
PostSchema.methods.getExtendedLikeStatus = Post.prototype.getExtendedLikeStatus;
PostSchema.methods.banUser = Post.prototype.banUser;

PostSchema.methods.checkOwnerPost = Post.prototype.checkOwnerPost;
PostSchema.methods.getBlogName = Post.prototype.getBlogName;
