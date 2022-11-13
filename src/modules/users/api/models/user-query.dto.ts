import { IsOptional, IsString } from 'class-validator';
import { PaginatorInputModel } from '../../../paginator/models/query-params.model';

export class GetQueryParamsUserDto extends PaginatorInputModel {
  @IsOptional()
  @IsString()
  searchLoginTerm: string;
  @IsOptional()
  @IsString()
  searchEmailTerm: string;
}
