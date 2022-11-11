import { Transform, TransformFnParams } from 'class-transformer';
import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';
import { PostInputModel } from '../types/post-input-model';

export class PostDto implements PostInputModel {
  @IsNotEmpty()
  @Transform(({ value }: TransformFnParams) => value?.trim())
  @MinLength(1)
  @MaxLength(30)
  @IsString()
  readonly title: string;

  @IsNotEmpty()
  @Transform(({ value }: TransformFnParams) => value?.trim())
  @MinLength(1)
  @MaxLength(100)
  @IsString()
  readonly shortDescription: string;

  @IsNotEmpty()
  @Transform(({ value }: TransformFnParams) => value?.trim())
  @MinLength(1)
  @MaxLength(1000)
  @IsString()
  readonly content: string;

  @IsNotEmpty()
  @IsString()
  readonly blogId: string;
}
