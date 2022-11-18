import { IsString, MaxLength, MinLength } from 'class-validator';

export class NewPasswordRecoveryInputModel {
  @IsString()
  @MaxLength(20)
  @MinLength(6)
  newPassword: string;
  @IsString()
  recoveryCode: string;
}
