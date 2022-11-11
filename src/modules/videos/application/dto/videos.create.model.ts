import { Type } from 'class-transformer';
import {
  IsEnum,
  IsOptional,
  IsString,
  IsArray,
  MaxLength,
  IsNotEmpty,
  ValidateNested,
} from 'class-validator';
import { Resolutions } from '../../domain/interfaces/enums';

export class CreateVideoInputModel {
  @IsNotEmpty()
  @MaxLength(40)
  @IsString()
  readonly title: string;
  @IsNotEmpty()
  @MaxLength(20)
  @IsString()
  readonly author: string;

  @IsOptional()
  @IsArray()
  @IsEnum(Resolutions, { each: true })
  readonly availableResolutions: Resolutions[];
}
