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

  async sendEmailMessage(email: string, link: string): Promise<void> {
    console.log(email, link);
    try {
      await this.sendMessageToEmailUseCase.execute(email, link);
    } catch (err) {
      throw new InternalServerErrorException();
    }
  }
}
