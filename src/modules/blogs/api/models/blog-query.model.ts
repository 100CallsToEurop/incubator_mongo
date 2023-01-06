import { IsOptional, IsString } from 'class-validator';
import { PaginatorInputModel } from '../../../../modules/paginator/models/query-params.model';


export class GetQueryParamsBlogDto extends PaginatorInputModel {
  @IsOptional()
  @IsString()
  searchNameTerm: string;
}

export class GetQueryParamsBlogUserDto extends PaginatorInputModel {
  @IsOptional()
  @IsString()
  searchLoginTerm: string;
}




