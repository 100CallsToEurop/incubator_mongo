import { BadRequestException } from '@nestjs/common';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { IUserInfoInputModel } from 'src/modules/likes-info/domain/interfaces/newest-like.interface';
import { ILikeInfo, ILikeInfoEntity } from '../../../../modules/likes-info/domain/interfaces/likes-info.interface';
import { LikeInfoSchema } from '../../../../modules/likes-info/domain/schema/like-info.schema';
import { CommentInputModel, LikeInputModel } from '../../api/models';
import { CommentEntity } from '../entity/comment.entity';
import {
  CommentDocument,
  CommentModelType,
  CommentStaticType,
  ICommentEntity,

} from '../interfaces/comment.interface';


@Schema({ collection: 'comments' })
export class Comments extends Document implements ICommentEntity {
  @Prop({ required: true, type: String })
  content: string;
  @Prop({ required: true, type: String })
  userId: string;
  @Prop({ required: true, type: String })
  userLogin: string;
  @Prop({ required: true, type: String })
  postId: string;
  @Prop({ required: true, type: Date })
  createdAt: Date;
  @Prop({ required: true, type: LikeInfoSchema })
  likesInfo: ILikeInfoEntity;

  public getContent(): string {
    return this.content;
  }
  public getUserId(): string {
    return this.userId;
  }
  public getUserLogin(): string {
    return this.userLogin;
  }
  public getPostId(): string {
    return this.postId;
  }
  public getCreatedAt(): Date {
    return this.createdAt;
  }

  public setContent(content: string): void {
    this.content = content;
  }
  public setUserId(userId: string): void {
    this.userId = userId;
  }
  public setUserLogin(userLogin: string): void {
    this.userLogin = userLogin;
  }
  public setPostId(postId: string): void {
    this.postId = postId;
  }
  public setCreatedAt(createdAt: Date): void {
    this.createdAt = createdAt;
  }

  public checkUser(userId: string): boolean{
    if(this.userId === userId) return true
    return false
  }

  public updateComment(userId: string, updateParams: CommentInputModel): void {
    if (this.checkUser(userId)){ 
      this.content = updateParams.content;
    } 
    throw new BadRequestException()
  }

  public updateLikeStatus(
    { likeStatus }: LikeInputModel,
    userId: string,
    login: string
  ): void {
    const updateParams: IUserInfoInputModel = {
      likeStatus,
      userId,
      login,
    };
    this.likesInfo.updateLikeStatus(updateParams);
  }

  public getLikeStatus(): ILikeInfo {
    return this.likesInfo.getLikeStatus(this.getUserId());
  }

  public banUser(banned: boolean): void {
    this.likesInfo.ban(this.getUserId(), banned);
  }

  public static createComment(
    newCommentEntity: CommentEntity,
    CommentModel: CommentModelType,
  ): CommentDocument {
    const newComment = new CommentModel(newCommentEntity);
    return newComment;
  }
}
export const CommentsSchema = SchemaFactory.createForClass(Comments);
const commentStaticMethod: CommentStaticType = {
  createComment: Comments.createComment,
};
CommentsSchema.statics = commentStaticMethod;

CommentsSchema.methods.getContent = Comments.prototype.getContent
CommentsSchema.methods.getUserId = Comments.prototype.getUserId;
CommentsSchema.methods.getUserLogin = Comments.prototype.getUserLogin;
CommentsSchema.methods.getPostId = Comments.prototype.getPostId
CommentsSchema.methods.getCreatedAt = Comments.prototype.getCreatedAt;

CommentsSchema.methods.setContent = Comments.prototype.setContent;
CommentsSchema.methods.setUserId = Comments.prototype.setUserId;
CommentsSchema.methods.setUserLogin = Comments.prototype.setUserLogin;
CommentsSchema.methods.setPostId = Comments.prototype.setPostId;
CommentsSchema.methods.setCreatedAt = Comments.prototype.setCreatedAt;

CommentsSchema.methods.updateComment = Comments.prototype.updateComment;
CommentsSchema.methods.updateLikeStatus = Comments.prototype.updateLikeStatus
CommentsSchema.methods.getLikeStatus = Comments.prototype.getLikeStatus;
CommentsSchema.methods.banUser = Comments.prototype.banUser;
CommentsSchema.methods.checkUser = Comments.prototype.checkUser;



