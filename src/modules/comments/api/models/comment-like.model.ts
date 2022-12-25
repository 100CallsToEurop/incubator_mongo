import { IsEnum, IsString } from "class-validator";
import { LikeStatus } from "../../../../modules/likes-info/domain/interfaces/likes-info.interface";


export class LikeInputModel {
  @IsString()
  @IsEnum(LikeStatus)
  likeStatus: LikeStatus;
}
