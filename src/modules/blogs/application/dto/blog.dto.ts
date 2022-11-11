import { IsString, IsUrl, MaxLength, Matches, IsNotEmpty } from 'class-validator';
import { BlogInputModel } from '../types/blog-input-model.type';

export class BlogDto implements BlogInputModel {
  //@IsString()
  @IsNotEmpty()
  @MaxLength(15)
  readonly name: string;
  //@IsString()
  @MaxLength(100)
  @Matches('^https://([a-zA-Z0-9_-]+.)+[a-zA-Z0-9_-]+(/[a-zA-Z0-9_-]+)*/?$')
  readonly youtubeUrl: string;
}
