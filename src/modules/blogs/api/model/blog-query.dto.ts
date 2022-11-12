import { IsOptional, IsString } from 'class-validator';
import { GetQueryParamsDto } from '../../../paginator/dto/query-params.dto';

export class GetQueryParamsBlogDto extends GetQueryParamsDto {
  @IsOptional()
  @IsString()
  searchNameTerm: string;
}
