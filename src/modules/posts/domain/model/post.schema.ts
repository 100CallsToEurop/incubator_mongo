import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { IExtendedLikesInfo, INewestLikes, IPost, LikeStatus } from '../interfaces/post.interface';

@Schema({ collection: 'users-comment-container' })
export class NewestLikes extends Document implements INewestLikes {
  @Prop({ required: true, type: String })
  userId: string;
  @Prop({ required: true, type: String })
  login: string;
  @Prop({
    required: true,
    enum: LikeStatus,
    default: LikeStatus.NONE,
    type: String,
  })
  status: LikeStatus;
  @Prop({ type: Date, timestamps: true })
  addedAt: Date;
}
export const NewestLikesSchema = SchemaFactory.createForClass(NewestLikes);

@Schema({ collection: 'like-info' })
export class ExtendedLikesInfo extends Document implements IExtendedLikesInfo {
  @Prop({ required: true, type: Number })
  likesCount: number;
  @Prop({ required: true, type: Number })
  dislikesCount: number;
  @Prop({
    required: true,
    enum: LikeStatus,
    default: LikeStatus.NONE,
    type: String,
  })
  myStatus: LikeStatus;
  @Prop({
    required: true,
    type: [NewestLikesSchema],
    default: [],
  })
  newestLikes: INewestLikes[];
}
export const ExtendedLikesInfoSchema = SchemaFactory.createForClass(ExtendedLikesInfo);


@Schema({ collection: 'posts' })
export class Post extends Document implements IPost {
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
  @Prop({ required: true, type: ExtendedLikesInfoSchema })
  extendedLikesInfo: IExtendedLikesInfo;
}

export const PostSchema = SchemaFactory.createForClass(Post);
