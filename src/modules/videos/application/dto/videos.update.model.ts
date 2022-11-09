import {
  IsBoolean,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  Min,
  Max,
} from 'class-validator';

export class UpdateVideoInputModel {
  @IsString()
  readonly title: string;
  @IsString()
  readonly author: string;
  @IsOptional()
  readonly availableResolutions: Array<string>;
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
