import {
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';

import { SendMessageToEmailUseCase } from '../../../modules/managers/application/useCases/sendMessageToEmail.use-case';

@Injectable()
export class AuthService {
  constructor(
    private readonly sendMessageToEmailUseCase: SendMessageToEmailUseCase,
  ) {}

  async sendEmailMessage(email: string, emailMessage: string): Promise<void> {
    try {
      await this.sendMessageToEmailUseCase.execute(email, emailMessage);
    } catch (err) {
      throw new InternalServerErrorException();
    }
  }
}
