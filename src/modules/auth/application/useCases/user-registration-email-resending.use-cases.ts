import { BadRequestException } from '@nestjs/common';
import { AuthService } from '../auth.service';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs/dist';
import { UsersRepository } from '../../../../modules/users/infrastructure/users.repository';

export class UserRegistrationEmailResendingCommand {
  constructor(public email: string) {}
}

@CommandHandler(UserRegistrationEmailResendingCommand)
export class UserRegistrationEmailResendingUseCase
  implements ICommandHandler<UserRegistrationEmailResendingCommand>
{
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly authService: AuthService,
  ) {}

  private async checkEmailOrLogin(emailOrLogin: string) {
    let field = '';
    emailOrLogin.indexOf('@') > -1 ? (field = 'email') : (field = 'login');
    const checkUserEmailOrLogin =
      await this.usersRepository.findUserByEmailOrLogin(emailOrLogin);
    if (!checkUserEmailOrLogin && field === 'email') {
      throw new BadRequestException({
        message: ['email incorrect'],
      });
    }
    return checkUserEmailOrLogin;
  }

  async execute(command: UserRegistrationEmailResendingCommand): Promise<void> {
    const { email } = command;
    const user = await this.checkEmailOrLogin(email);

    if (user.getConfirmationState()) {
      throw new BadRequestException({
        message: ['email already activated'],
      });
    }
    const emailMessage = user.getMessageCode();
    await this.usersRepository.save(user)
    await this.authService.sendEmailMessage(email, emailMessage);
  }
}
