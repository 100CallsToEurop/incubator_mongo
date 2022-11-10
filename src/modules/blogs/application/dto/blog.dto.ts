import { IsString, IsUrl, MaxLength } from 'class-validator';
import { BlogInputModel } from '../types/blog-input-model.type';

export class BlogDto implements BlogInputModel {
  @IsString()
  @MaxLength(15)
  readonly name: string;
  @IsString()
  @MaxLength(100)
  @IsUrl()
  readonly youtubeUrl: string;
}
