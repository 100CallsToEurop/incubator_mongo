import { Type } from "class-transformer";
import { IsOptional, IsInt, IsString } from "class-validator";

export class TopUsersQueryDto {
  @IsOptional()
  @IsInt()
  @Type(() => Number)
  pageNumber?: number;
  @IsOptional()
  @IsInt()
  @Type(() => Number)
  pageSize?: number;
  @IsOptional()
  sort?;
}