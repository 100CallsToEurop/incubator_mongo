import { CommandHandler, ICommandHandler } from '@nestjs/cqrs/dist';
import { UsersRepository } from '../../infrastructure/users.repository';

export class UpdateConfirmationStateCommand {
  constructor(public userId: string) {}
}

@CommandHandler(UpdateConfirmationStateCommand)
export class UpdateConfirmationStateUseCase
  implements ICommandHandler<UpdateConfirmationStateCommand>
{
  constructor(private readonly usersRepository: UsersRepository) {}

  async execute(command: UpdateConfirmationStateCommand): Promise<void> {
    const { userId } = command;
    await this.usersRepository.updateConfirmationState(userId);
  }
}
