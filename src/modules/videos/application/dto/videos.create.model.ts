import { IsEnum, IsOptional, IsString, IsArray } from 'class-validator';
import { Resolutions } from '../../domain/interfaces/enums';

export class CreateVideoInputModel {
  @IsString()
  readonly title: string;
  @IsString()
  readonly author: string;

  @IsOptional()
  @IsArray()
  //@IsEnum(Resolutions)
  readonly availableResolutions: Array<string>;
}
