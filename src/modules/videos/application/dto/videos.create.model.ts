import {
  IsEnum,
  IsOptional,
  IsString,
  IsArray,
  MaxLength,
} from 'class-validator';
import { Resolutions } from '../../domain/interfaces/enums';

export class CreateVideoInputModel {
  @MaxLength(40)
  @IsString()
  readonly title: string;
  @MaxLength(20)
  @IsString()
  readonly author: string;

  @IsOptional()
  @IsArray()
  //@IsEnum(Resolutions)
  readonly availableResolutions: Array<string>;
}
