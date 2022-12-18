import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UserInputModel } from '../../api/models';
import { UsersRepository } from '../../infrastructure/users.repository';

export class UpdateUserByIdCommand {
  constructor(public userId: string, public updateParam: UserInputModel) {}
}

@CommandHandler(UpdateUserByIdCommand)
export class UpdateUserByIdUseCase
  implements ICommandHandler<UpdateUserByIdCommand>
{
  constructor(private readonly usersRepository: UsersRepository) {}

  async execute(command: UpdateUserByIdCommand): Promise<void> {
    const { userId, updateParam } = command;
    await this.usersRepository.updateUser(userId, updateParam);
  }
}
