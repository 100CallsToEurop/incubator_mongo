import { IsEnum, IsString } from "class-validator";
import { LikeStatus } from "../../domain/interfaces/post.interface";


export class LikeInputModel {
  @IsString()
  @IsEnum(LikeStatus)
  likeStatus: LikeStatus;
}
