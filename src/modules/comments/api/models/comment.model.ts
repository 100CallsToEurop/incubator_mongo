import { MaxLength, MinLength, IsNotEmpty } from 'class-validator';

export class CommentInputModel {
  //@IsString()
  @IsNotEmpty()
  @MinLength(20)
  @MaxLength(300)
  readonly content: string;
}
