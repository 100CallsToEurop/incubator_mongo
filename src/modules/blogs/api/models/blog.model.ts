import { Transform, TransformFnParams } from 'class-transformer';
import {
  IsString,
  IsUrl,
  MaxLength,
  Matches,
  MinLength,
  IsNotEmpty,
} from 'class-validator';

export class BlogInputModel {
  //@IsString()
  @IsNotEmpty()
  @Transform(({ value }: TransformFnParams) => value?.trim())
  @MinLength(1)
  @MaxLength(15)
  readonly name: string;

  @MaxLength(500)
  readonly description: string;

  //@IsString()
  @MaxLength(100)
  @Matches(
    '^https://([a-zA-Z0-9_-]+\\.)+[a-zA-Z0-9_-]+(\\/[a-zA-Z0-9_-]+)*\\/?$',
  )
  readonly websiteUrl: string;
}
