import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import {
  ILikeInfo,
  ILikeInfoEntity,
  LikeStatus,
} from '../interfaces/likes-info.interface';
import {
  INewestLikesEntity,
  IUserInfoInputModel,
} from '../interfaces/newest-like.interface';
import { NewestLikes, NewestLikesSchema } from './newest-likes.schema';
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
    type: [NewestLikesSchema],
    default: [],
  })
  newestLikes: INewestLikesEntity[];

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
    return this.newestLikes.reduce((acc, likeInfo) => {
      if (likeInfo.status === likeStatus && likeInfo.isBanned === false)
        return acc + 1;
    }, 0);
  }

  public containedUser(userId: string): INewestLikesEntity {
    return this.newestLikes.find((likeInfo) => likeInfo.checkUserId(userId));
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

  public updateLikeInfo(userId: string, ...args): INewestLikesEntity[] {
    this.newestLikes = this.newestLikes.map((likeInfo) => {
      if (likeInfo.checkUserId(userId)) {
        for (let arg of args) {
          if (this.isBoolean(arg)) likeInfo.setIsBanned(arg);
          if (this.isLikeStatus(arg)) likeInfo.setStatus(arg);
        }
      }
      return likeInfo;
    });
    return this.newestLikes;
  }

  public recountStatus() {
    let likesCount = 0;
    let dislikesCount = 0;
    likesCount = this.foldUserStatus(LikeStatus.LIKE);
    dislikesCount = this.foldUserStatus(LikeStatus.DISLIKE);
    this.collectLikesInfo(likesCount, dislikesCount);
  }

  public findMyStatus(userId: string): void {
    const checkUserLikesInfo = this.containedUser(userId);
    checkUserLikesInfo
      ? this.setMyStatus(checkUserLikesInfo.status)
      : this.setMyStatus(LikeStatus.NONE);
  }

  public updateLikeStatus(userParams: IUserInfoInputModel): void {
    const { likeStatus, userId } = userParams;
    let likesInfo = this.newestLikes;
    const checkUserLikesInfo = this.containedUser(userId);
    if (checkUserLikesInfo) {
      likesInfo = this.updateLikeInfo(likeStatus);
    } else {
      const newLikeInfo = new NewestLikes();
      newLikeInfo.setUserInfo(userParams);
      likesInfo.push(newLikeInfo);
    }
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

  public getNewestLikes(): INewestLikesEntity[] {
    let newestLikes;
    const likeInfo = this.newestLikes;
    if (likeInfo.length > 3) {
      newestLikes = likeInfo.slice(-3).reverse();
    } else newestLikes = likeInfo.reverse();
    return newestLikes;
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
LikeInfoSchema.methods.containedUser= LikeInfo.prototype.containedUser;
LikeInfoSchema.methods.foldUserStatus= LikeInfo.prototype.foldUserStatus;
LikeInfoSchema.methods.collectLikesInfo= LikeInfo.prototype.collectLikesInfo;
