import { CommandBus, CommandHandler, ICommandHandler } from '@nestjs/cqrs/dist';
import { DeleteDeviceCommand } from '../../../../modules/security-devices/application/useCases';
import { DecodeJWTTokenCommand } from '../../../../modules/tokens/application/useCases';
import { AddBadRefreshTokenCommand } from '../../../../modules/users/application/useCases';

export class UserLogoutCommand {
  constructor(public refreshToken: string) {}
}

@CommandHandler(UserLogoutCommand)
export class UserLogoutUseCase implements ICommandHandler<UserLogoutCommand> {
  constructor(private readonly commandBus: CommandBus) {}

  async execute(command: UserLogoutCommand) {
    const { refreshToken } = command;
    const decodeRefreshToken = await this.commandBus.execute(
      new DecodeJWTTokenCommand(refreshToken),
    );
    const { userId, deviceId } = decodeRefreshToken;
    await this.commandBus.execute(new DeleteDeviceCommand(userId, deviceId));
    await this.commandBus.execute(
      new AddBadRefreshTokenCommand(refreshToken, null),
    );
  }
}
