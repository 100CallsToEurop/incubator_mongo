import { CommandHandler, ICommandHandler } from '@nestjs/cqrs/dist';
import { UsersRepository } from '../../infrastructure/users.repository';

export class UpdateUserRefreshTokenCommand {
  constructor(public userId: string, public refreshToken: string) {}
}

@CommandHandler(UpdateUserRefreshTokenCommand)
export class UpdateUserRefreshTokenUseCase
  implements ICommandHandler<UpdateUserRefreshTokenCommand>
{
  constructor(private readonly usersRepository: UsersRepository) {}

  async execute(command: UpdateUserRefreshTokenCommand): Promise<void> {
    const { userId, refreshToken } = command;
    await this.usersRepository.updateRefreshToken(userId, refreshToken);
  }
}
