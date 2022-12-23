import { CommandBus, CommandHandler, ICommandHandler } from '@nestjs/cqrs/dist';
import { UsersRepository } from '../../../../modules/users/infrastructure/users.repository';
import { DeleteDeviceCommand } from '../../../../modules/security-devices/application/useCases';
import { DecodeJWTTokenCommand } from '../../../../modules/tokens/application/useCases';
import { UnauthorizedException } from '@nestjs/common';

export class UserLogoutCommand {
  constructor(public refreshToken: string) {}
}

@CommandHandler(UserLogoutCommand)
export class UserLogoutUseCase implements ICommandHandler<UserLogoutCommand> {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly commandBus: CommandBus,
  ) {}

  async execute(command: UserLogoutCommand) {
    const { refreshToken } = command;
    const getUserByInvalidToken = await this.usersRepository.findBadToken(
      refreshToken,
    );

    if (getUserByInvalidToken) {
      throw new UnauthorizedException();
    }
    const decodeRefreshToken = await this.commandBus.execute(
      new DecodeJWTTokenCommand(refreshToken),
    );

    const { userId, deviceId } = decodeRefreshToken;
    await this.commandBus.execute(new DeleteDeviceCommand(userId, deviceId));

    const user = await this.usersRepository.getUserById(userId);
    user.updateRefreshToken(null);
    user.addBadRefreshToken(refreshToken);
    await this.usersRepository.save(user);
  }
}
