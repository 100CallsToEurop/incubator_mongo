import { IsNotEmpty, Matches } from 'class-validator';

export class RegistrationEmailResending {
  @IsNotEmpty()
  @Matches('^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$')
  email: string;
}
