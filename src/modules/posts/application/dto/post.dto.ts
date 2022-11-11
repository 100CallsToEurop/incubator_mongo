import { IsString, MaxLength } from 'class-validator';
import { PostInputModel } from '../types/post-input-model';

export class PostDto implements PostInputModel {
  @MaxLength(30)
  @IsString()
  readonly title: string;

  @MaxLength(100)
  @IsString()
  readonly shortDescription: string;

  @MaxLength(1000)
  @IsString()
  readonly content: string;


  @IsString()
  readonly blogId: string;
}
