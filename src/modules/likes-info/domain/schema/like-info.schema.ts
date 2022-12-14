import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import {
  ILikeInfo,
  ILikeInfoEntity,
  LikeStatus,
} from '../interfaces/likes-info.interface';
import {
  INewestLikes,
  IUserInfoInputModel,
} from '../interfaces/newest-like.interface';
import { Document } from 'mongoose';

@Schema({ collection: 'like-info' })
export class LikeInfo extends Document implements ILikeInfoEntity {
  @Prop({ required: true, type: Number, default: 0 })
  likesCount: number;
  @Prop({ required: true, type: Number, default: 0 })
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
    type: Array,
    default: [],
  })
  newestLikes: INewestLikes[];

  public setLikesCount(likesCount: number): void {
    this.likesCount = likesCount;
  }
  public setDislikesCount(dislikesCount: number): void {
    this.dislikesCount = dislikesCount;
  }

  public setMyStatus(myStatus: LikeStatus): void {
    this.myStatus = myStatus;
  }

  public getLikesCount(): number {
    return this.likesCount;
  }
  public getDislikesCount(): number {
    return this.dislikesCount;
  }
  public getMyStatus(): LikeStatus {
    return this.myStatus;
  }

  public collectLikesInfo(likesCount: number, dislikesCount: number) {
    this.setLikesCount(likesCount);
    this.setDislikesCount(dislikesCount);
  }

  public foldUserStatus(likeStatus: LikeStatus): number {
    const sumStatus = this.newestLikes.reduce((acc, likeInfo) => {
      if (likeInfo.status === likeStatus && !likeInfo.isBanned) return acc + 1;
      return acc;
    }, 0);
    return sumStatus ? sumStatus : 0;
  }

  public containedUser(userId: string): INewestLikes {
    return this.newestLikes.find((likeInfo) => likeInfo.userId === userId);
  }

  public isBoolean(arg: boolean | LikeStatus): arg is boolean {
    return typeof arg === 'boolean';
  }

  public isLikeStatus(arg: boolean | LikeStatus): arg is LikeStatus {
    if (
      arg.valueOf() === LikeStatus.DISLIKE ||
      arg.valueOf() === LikeStatus.LIKE ||
      arg.valueOf() === LikeStatus.NONE
    ) {
      return true;
    }
    return false;
  }

  public updateLikeInfo(userId: string, ...args): INewestLikes[] {
    return this.newestLikes.map((likeInfo) => {
      if (likeInfo.userId === userId) {
        for (let arg of args) {
          if (this.isBoolean(arg)) likeInfo.isBanned = arg;
          if (this.isLikeStatus(arg)) likeInfo.status = arg;
        }
      }
      return likeInfo;
    });
  }

  public recountStatus() {
    const likesCount = this.foldUserStatus(LikeStatus.LIKE);
    const dislikesCount = this.foldUserStatus(LikeStatus.DISLIKE);
    this.collectLikesInfo(likesCount, dislikesCount);
  }

  public findMyStatus(userId?: string): void {
    if (!userId) return this.setMyStatus(LikeStatus.NONE);
    const checkUserLikesInfo = this.containedUser(userId);
    checkUserLikesInfo
      ? this.setMyStatus(checkUserLikesInfo.status)
      : this.setMyStatus(LikeStatus.NONE);
  }

  public updateLikeStatus(userParams: IUserInfoInputModel): void {
    const { likeStatus, userId, login } = userParams;
    const checkUserLikesInfo = this.containedUser(userId);
    if (checkUserLikesInfo) {
      this.newestLikes = this.updateLikeInfo(userId, likeStatus);
    } else {
      const newLikeInfo = {
        addedAt: new Date(),
        userId,
        login,
        status: likeStatus,
        isBanned: false,
      };
      this.newestLikes.push(newLikeInfo);
    }
    this.findMyStatus(userId);
    this.recountStatus();
  }

  public getLikeStatus(userId: string): ILikeInfo {
    this.findMyStatus(userId);
    this.recountStatus();
    return {
      likesCount: this.getLikesCount(),
      dislikesCount: this.getDislikesCount(),
      myStatus: this.getMyStatus(),
    };
  }

  public getExtendedLikeStatus(userId: string) {
    this.findMyStatus(userId);
    this.recountStatus();
    return {
      likesCount: this.getLikesCount(),
      dislikesCount: this.getDislikesCount(),
      myStatus: this.getMyStatus(),
      newestLikes: this.getNewestLikes(),
    };
  }

  public getNewestLikes(): INewestLikes[] {
    const responseNewestLikes = this.newestLikes.filter(
      (likeInfo) => likeInfo.status === LikeStatus.LIKE,
    );
    if (responseNewestLikes.length > 3) {
      return responseNewestLikes.slice(-3).reverse();
    } else return responseNewestLikes.reverse();
  }

  public ban(userId: string, banned: boolean): void {
    const checkUserLikesInfo = this.containedUser(userId);
    if (checkUserLikesInfo) {
      this.newestLikes = this.updateLikeInfo(userId, banned);
      this.recountStatus();
    }
  }
}
export const LikeInfoSchema = SchemaFactory.createForClass(LikeInfo);

LikeInfoSchema.methods.setLikesCount = LikeInfo.prototype.setLikesCount;
LikeInfoSchema.methods.setDislikesCount = LikeInfo.prototype.setDislikesCount;
LikeInfoSchema.methods.setMyStatus = LikeInfo.prototype.setMyStatus;

LikeInfoSchema.methods.getLikesCount = LikeInfo.prototype.getLikesCount;
LikeInfoSchema.methods.getDislikesCount = LikeInfo.prototype.getDislikesCount;
LikeInfoSchema.methods.getMyStatus = LikeInfo.prototype.getMyStatus;

LikeInfoSchema.methods.updateLikeStatus = LikeInfo.prototype.updateLikeStatus;
LikeInfoSchema.methods.getLikeStatus = LikeInfo.prototype.getLikeStatus;
LikeInfoSchema.methods.ban = LikeInfo.prototype.ban;
LikeInfoSchema.methods.getExtendedLikeStatus =
  LikeInfo.prototype.getExtendedLikeStatus;

LikeInfoSchema.methods.findMyStatus = LikeInfo.prototype.findMyStatus;
LikeInfoSchema.methods.getNewestLikes = LikeInfo.prototype.getNewestLikes;
LikeInfoSchema.methods.recountStatus = LikeInfo.prototype.recountStatus;
LikeInfoSchema.methods.updateLikeInfo = LikeInfo.prototype.updateLikeInfo;
LikeInfoSchema.methods.isLikeStatus = LikeInfo.prototype.isLikeStatus;
LikeInfoSchema.methods.isBoolean = LikeInfo.prototype.isBoolean;
LikeInfoSchema.methods.containedUser = LikeInfo.prototype.containedUser;
LikeInfoSchema.methods.foldUserStatus = LikeInfo.prototype.foldUserStatus;
LikeInfoSchema.methods.collectLikesInfo = LikeInfo.prototype.collectLikesInfo;
