import { CommandHandler, ICommandHandler } from '@nestjs/cqrs/dist';
import { UsersRepository } from '../../infrastructure/users.repository';

export class UpdatePassportRecoveryCommand {
  constructor(public userId: string, public newCode: string) {}
}

@CommandHandler(UpdatePassportRecoveryCommand)
export class UpdatePassportRecoveryUseCase
  implements ICommandHandler<UpdatePassportRecoveryCommand>
{
  constructor(private readonly usersRepository: UsersRepository) {}

  async execute(command: UpdatePassportRecoveryCommand): Promise<void> {
    const { userId, newCode } = command;
    await this.usersRepository.updatePasswordRecoveryCode(userId, newCode);
  }
}
