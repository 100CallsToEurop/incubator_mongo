import { IsEnum, IsOptional, IsString } from 'class-validator';
import { PaginatorInputModel } from '../../../../../modules/paginator/models/query-params.model';
import { PUB_STATUS } from '../view';



export class GetQueryParamsQuestionDto extends PaginatorInputModel {
  @IsOptional()
  @IsString()
  bodySearchTerm: string;
  @IsOptional()
  @IsString()
  @IsEnum(PUB_STATUS)
  publishedStatus: PUB_STATUS;
}


