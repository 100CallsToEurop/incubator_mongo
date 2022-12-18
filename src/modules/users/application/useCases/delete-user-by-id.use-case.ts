import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UsersRepository } from '../../infrastructure/users.repository';

export class DeleteUserByIdCommand {
  constructor(public userId: string) {}
}

@CommandHandler(DeleteUserByIdCommand)
export class DeleteUserByIdUseCase
  implements ICommandHandler<DeleteUserByIdCommand>
{
  constructor(private readonly usersRepository: UsersRepository) {}

  async execute(command: DeleteUserByIdCommand): Promise<void> {
    const { userId } = command;
    await this.usersRepository.deleteUserById(userId);
  }
}
