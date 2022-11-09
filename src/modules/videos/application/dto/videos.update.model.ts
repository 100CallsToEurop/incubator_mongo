import {
  IsBoolean,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  Min,
  Max,
} from 'class-validator';
import { Resolutions } from '../../domain/interfaces/enums';

export class UpdateVideoInputModel {
  @IsString()
  readonly title: string;
  @IsString()
  readonly author: string;
  @IsOptional()
  @IsEnum(Resolutions)
  readonly availableResolutions: Resolutions;
  @IsOptional()
  @IsBoolean()
  readonly canBeDownloaded: boolean;
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(18)
  readonly minAgeRestriction: number;
  @IsOptional()
  @IsString()
  readonly publicationDate: string;
}
