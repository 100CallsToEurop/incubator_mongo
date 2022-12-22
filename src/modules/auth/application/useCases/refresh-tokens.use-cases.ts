import {
  DecodeJWTTokenCommand,
} from '../../../../modules/tokens/application/useCases';

import { DeviceInputModel } from '../../../../modules/security-devices/api/models';
import { TokensViewModel } from '../../../../modules/tokens/application/dto';
import { UserLoginCommand } from './user-login.use-cases';
import { CommandBus, CommandHandler } from '@nestjs/cqrs';
import { ICommandHandler } from '@nestjs/cqrs/dist';
import { UsersRepository } from '../../../../modules/users/infrastructure/users.repository';

export class RefreshTokensCommand {
  constructor(
    public oldRefreshToken: string,
    public device: DeviceInputModel,
  ) {}
}

@CommandHandler(RefreshTokensCommand)
export class RefreshTokensUseCase
  implements ICommandHandler<RefreshTokensCommand>
{
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly commandBus: CommandBus,
  ) {}

  async execute(command: RefreshTokensCommand): Promise<TokensViewModel> {
    const { oldRefreshToken, device } = command;
    const decodeOldRefreshToken = await this.commandBus.execute(
      new DecodeJWTTokenCommand(oldRefreshToken),
    );
    const { deviceId, iat, exp, ...user } = decodeOldRefreshToken;
    const newTokens = await this.commandBus.execute(
      new UserLoginCommand(user, device, deviceId),
    );
    const userUpdate = await this.usersRepository.getUserById(user.userId);
    userUpdate.updateRefreshToken(newTokens.refreshToken);
    userUpdate.addBadRefreshToken(oldRefreshToken);
    await this.usersRepository.save(user);

    return newTokens;
  }
}
