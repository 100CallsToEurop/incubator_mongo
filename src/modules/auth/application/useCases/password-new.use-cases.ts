import { BadRequestException, Injectable } from '@nestjs/common';
import { UsersQueryRepository } from '../../../../modules/users/api/queryRepository/users.query.repository';
import { CommandBus, CommandHandler, ICommandHandler } from '@nestjs/cqrs/dist';
import { UpdateUserPasswordCommand } from '../../../../modules/users/application/useCases';

export class PasswordNewCommand {
  constructor(public newPassword: string, public recoveryCode: string) {}
}

@CommandHandler(PasswordNewCommand)
export class PasswordNewUseCase implements ICommandHandler<PasswordNewCommand> {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly usersQueryRepository: UsersQueryRepository,
  ) {}

  async execute(command: PasswordNewCommand) {
    const { recoveryCode, newPassword } = command;
    const user = await this.usersQueryRepository.findByPasswordRecoveryCode(
      recoveryCode,
    );
    if (!user) {
      throw new BadRequestException({
        message: ['recoveryCode invalid'],
      });
    }

    if (
      !user.passwordRecovery.isConfirmedPassword ||
      user.passwordRecovery.passwordRecoveryCode !== recoveryCode ||
      user.passwordRecovery.expirationDate < new Date()
    ) {
      throw new BadRequestException({
        message: ['recoveryCode invalid'],
      });
    }

    await this.commandBus.execute(
      new UpdateUserPasswordCommand(user._id.toString(), newPassword),
    );
  }
}
