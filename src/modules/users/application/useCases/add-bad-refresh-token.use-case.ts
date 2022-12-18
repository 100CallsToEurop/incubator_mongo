import { CommandHandler, ICommandHandler } from '@nestjs/cqrs/dist';
import { UsersRepository } from '../../infrastructure/users.repository';

export class AddBadRefreshTokenCommand {
  constructor(
    public badRefreshToken: string,
    public newRefreshToken: string | null,
  ) {}
}

@CommandHandler(AddBadRefreshTokenCommand)
export class AddBadRefreshTokenUseCase
  implements ICommandHandler<AddBadRefreshTokenCommand>
{
  constructor(private readonly usersRepository: UsersRepository) {}

  async execute(command: AddBadRefreshTokenCommand): Promise<void> {
    const { badRefreshToken, newRefreshToken } = command;
    await this.usersRepository.addInBadToken(badRefreshToken, newRefreshToken);
  }
}
