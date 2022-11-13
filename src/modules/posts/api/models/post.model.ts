import { Transform, TransformFnParams } from 'class-transformer';
import {
  IsMongoId,
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { ValidateBlogIdDecorator } from '../../../../common/decorators/check-blog-id.decorator';

export class PostInputModel {
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

  @ValidateBlogIdDecorator()
  @IsMongoId()
  @IsNotEmpty()
  @IsString()
  readonly blogId: string;
}
