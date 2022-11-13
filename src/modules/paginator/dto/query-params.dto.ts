import { Type } from 'class-transformer';
import { IsEnum, IsInt, IsOptional, IsString } from 'class-validator';
import { PaginatorInputModel, SortDirection } from '../types/paginator.type';

export class GetQueryParamsDto implements PaginatorInputModel {
  @IsOptional()
  @IsInt()
  @Type(() => Number)
  pageNumber?: number;
  @IsOptional()
  @IsInt()
  @Type(() => Number)
  pageSize?: number;
  @IsOptional()
  @IsString()
  sortBy?: string;
  @IsOptional()
  @Type(() => String)
  @IsEnum(SortDirection)
  @IsString()
  sortDirection?: SortDirection;
}
