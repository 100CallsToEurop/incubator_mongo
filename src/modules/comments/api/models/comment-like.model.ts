import { IsEnum, IsString } from "class-validator";
import { LikeStatus } from "../../domain/interfaces/comment.interface";


export class LikeInputModel {
  @IsString()
  @IsEnum(LikeStatus)
  likeStatus: LikeStatus;
}
