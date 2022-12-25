import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { LikeStatus } from '../interfaces/likes-info.interface';
import { Document } from 'mongoose';
import {
  INewestLikesEntity,
  IUserInfoInputModel,
} from '../interfaces/newest-like.interface';

@Schema({ collection: 'users-comment-container' })
export class NewestLikes extends Document implements INewestLikesEntity {
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
  @Prop({ required: true, type: Date, default: new Date() })
  addedAt: Date;
  @Prop({
    required: true,
    default: false,
    type: Boolean,
  })
  isBanned: boolean;

  public setUserId(userId: string): void {
    this.userId = userId;
  }
  public setStatus(status: LikeStatus): void {
    this.status = status;
  }
  public setIsBanned(isBanned: boolean): void {
    this.isBanned = isBanned;
  }
  public setLogin(login: string): void {
    this.login = login;
  }
  public setAddedAt(addedAt: Date): void {
    this.addedAt = addedAt;
  }

  public getUserId(): string {
    return this.userId;
  }
  public getStatus(): LikeStatus {
    return this.status;
  }
  public getIsBanned(): boolean {
    return this.isBanned;
  }
  public getLogin(): string {
    return this.login;
  }
  public getAddedAt(): Date {
    return this.addedAt;
  }

  public checkUserId(userId: string): boolean {
    if (this.userId === userId) return true;
    return false;
  }

  public setUserInfo(userInfo: IUserInfoInputModel): void {
    this.setUserId(userInfo.userId);
    this.setLogin(userInfo.login);
    this.setStatus(userInfo.likeStatus);
    this.setAddedAt(new Date());
  }
}
export const NewestLikesSchema = SchemaFactory.createForClass(NewestLikes);

NewestLikesSchema.methods.setUserId = NewestLikes.prototype.setUserId;
NewestLikesSchema.methods.setStatus = NewestLikes.prototype.setStatus;
NewestLikesSchema.methods.setIsBanned = NewestLikes.prototype.setIsBanned;
NewestLikesSchema.methods.setLogin = NewestLikes.prototype.setLogin;
NewestLikesSchema.methods.setAddedAt = NewestLikes.prototype.setAddedAt;

NewestLikesSchema.methods.getUserId = NewestLikes.prototype.getUserId;
NewestLikesSchema.methods.getStatus = NewestLikes.prototype.getStatus;
NewestLikesSchema.methods.getIsBanned = NewestLikes.prototype.getIsBanned;
NewestLikesSchema.methods.getLogin = NewestLikes.prototype.getLogin;
NewestLikesSchema.methods.getAddedAt = NewestLikes.prototype.getAddedAt;

NewestLikesSchema.methods.setUserInfo = NewestLikes.prototype.setUserInfo;
NewestLikesSchema.methods.checkUserId = NewestLikes.prototype.checkUserId;
