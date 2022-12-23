import { Type } from "class-transformer";
import { IsOptional, IsString } from "class-validator";

export class DeviceInputModel {
  @Type(() => String)
  @IsString()
  email: string;

  @Type(() => String)
  @IsString()
  login: string;

  @Type(() => String)
  @IsString()
  userId: string;

  @Type(() => String)
  @IsString()
  ip: string;

  @Type(() => String)
  @IsString()
  user_agent: string;

  @IsOptional()
  @Type(() => String)
  @IsString()
  deviceId?: string;
}