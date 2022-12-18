import { BadRequestException, Injectable } from '@nestjs/common';
import * as uuid from 'uuid';
import { AuthService } from '../auth.service';
import { UsersQueryRepository } from '../../../../modules/users/api/queryRepository/users.query.repository';
import { CommandBus, CommandHandler, ICommandHandler } from '@nestjs/cqrs/dist';
import { UpdatePassportRecoveryCommand } from '../../../../modules/users/application/useCases';

export class PasswordRecoveryCommand {
  constructor(public email: string) {}
}

@CommandHandler(PasswordRecoveryCommand)
export class PasswordRecoveryUseCase
  implements ICommandHandler<PasswordRecoveryCommand>
{
  constructor(
    private readonly authService: AuthService,
    private readonly usersQueryRepository: UsersQueryRepository,
    private readonly commandBus: CommandBus,
  ) {}

  async execute(command: PasswordRecoveryCommand) {
    const {email} = command
    const user = await this.usersQueryRepository.findUserByEmailOrLogin(email);
    if (!user) return;
    if (user.passwordRecovery.isConfirmedPassword) {
      throw new BadRequestException({
        message: ['email already sent a link on a new password'],
      });
    }
    const newCode = (user.passwordRecovery.passwordRecoveryCode = uuid.v4());
    await this.commandBus.execute(
      new UpdatePassportRecoveryCommand(user._id.toString(), newCode),
    );
    const code = user.passwordRecovery.passwordRecoveryCode;
    const link = `To finish password recovery please follow the link below: 
    <a href="https://somesite.com/password-recovery?recoveryCode=${code}">
    recovery password</a>"`;

    await this.authService.sendEmailMessage(user.accountData.email, link);

    return newCode;
  }
}
