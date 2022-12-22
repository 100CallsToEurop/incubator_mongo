import { BadRequestException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs/dist';
import { UsersRepository } from '../../../../modules/users/infrastructure/users.repository';

export class PasswordNewCommand {
  constructor(public newPassword: string, public recoveryCode: string) {}
}

@CommandHandler(PasswordNewCommand)
export class PasswordNewUseCase implements ICommandHandler<PasswordNewCommand> {
  constructor(private readonly usersRepository: UsersRepository) {}

  async execute(command: PasswordNewCommand) {
    const { recoveryCode, newPassword } = command;
    const user = await this.usersRepository.findByPasswordRecoveryCode(
      recoveryCode,
    );
    if (!user || user.checkPasswordConfirmed(recoveryCode)) {
      throw new BadRequestException({
        message: ['recoveryCode invalid'],
      });
    }
    user.updatePassword(newPassword);
    await this.usersRepository.save(user);
  }
}
