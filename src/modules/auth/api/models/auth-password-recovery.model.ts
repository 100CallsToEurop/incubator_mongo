import { IsNotEmpty, Matches } from 'class-validator';
import { ValidateEmailRecoveryDecorator } from '../../../../common/decorators/check-email-recovery.decorator';

export class PasswordRecoveryInputModel {
  @ValidateEmailRecoveryDecorator()
  @IsNotEmpty()
  @Matches('^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$')
  email: string;
}
