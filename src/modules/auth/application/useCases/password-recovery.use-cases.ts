import { BadRequestException, Injectable } from '@nestjs/common';
import { AuthService } from '../auth.service';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs/dist';
import { UsersRepository } from '../../../../modules/users/infrastructure/users.repository';

export class PasswordRecoveryCommand {
  constructor(public email: string) {}
}

@CommandHandler(PasswordRecoveryCommand)
export class PasswordRecoveryUseCase
  implements ICommandHandler<PasswordRecoveryCommand>
{
  constructor(
    private readonly authService: AuthService,
    private readonly usersRepository: UsersRepository,
  ) {}

  async execute(command: PasswordRecoveryCommand): Promise<void> {
    const { email } = command;
    const user = await this.usersRepository.findUserByEmailOrLogin(email);
    if (!user) return;

    if (user.getPasswordConfirmationState()) {
      throw new BadRequestException({
        message: ['email already sent a link on a new password'],
      });
    }
    const emailMessage = user.getPasswordMessageCode();
    await this.usersRepository.save(user)
    await this.authService.sendEmailMessage(email, emailMessage);
  }
}
