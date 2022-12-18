import { CommandHandler, ICommandHandler } from '@nestjs/cqrs/dist';
import { UsersRepository } from '../../infrastructure/users.repository';

export class UpdateConfirmationCodeCommand {
  constructor(public userId: string, public newCode: string) {}
}

@CommandHandler(UpdateConfirmationCodeCommand)
export class UpdateConfirmationCodeUseCase
  implements ICommandHandler<UpdateConfirmationCodeCommand>
{
  constructor(private readonly usersRepository: UsersRepository) {}

  async execute(command: UpdateConfirmationCodeCommand): Promise<void> {
    const { userId, newCode } = command;
    await this.usersRepository.updateConfirmationCode(userId, newCode);
  }
}
