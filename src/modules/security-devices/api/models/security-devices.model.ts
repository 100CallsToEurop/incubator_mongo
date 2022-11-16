import { Type } from "class-transformer";
import { IsString } from "class-validator";

export class DeviceInputModel {
  @Type(() => String)
  @IsString()
  ip: string;

  @Type(() => String)
  @IsString()
  user_agent: string;
}