import { Type } from 'class-transformer';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { PaginatorInputModel } from '../../../paginator/models/query-params.model';

export enum userBan {
  ALL = 'all',
  BANNED = 'banned',
  NOT_BANNED = 'notBanned',
}

export class GetQueryParamsUserDto extends PaginatorInputModel {
  @IsOptional()
  @IsString()
  searchLoginTerm: string;
  @IsOptional()
  @IsString()
  searchEmailTerm: string;
}

export class GetQueryParamsUserDtoForSA extends GetQueryParamsUserDto {
  @IsOptional()
  @Type(() => String)
  @IsString()
  @IsEnum(userBan)
  banStatus: userBan;
}
