import {
  IsBoolean,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  Min,
  Max,
  MaxLength,
  IsNotEmpty,
} from 'class-validator';

export class UpdateVideoInputModel {
  @IsNotEmpty()
  @MaxLength(40)
  @IsString()
  readonly title: string;
  @IsNotEmpty()
  @MaxLength(20)
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
