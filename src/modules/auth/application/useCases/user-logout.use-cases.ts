import { CommandBus, CommandHandler, ICommandHandler } from '@nestjs/cqrs/dist';
import { UsersRepository } from '../../../../modules/users/infrastructure/users.repository';
import { DeleteDeviceCommand } from '../../../../modules/security-devices/application/useCases';
import { DeviceInputModel } from '../../../../modules/security-devices/api/models';

export class UserLogoutCommand {
  constructor(public device: DeviceInputModel) {}
}

@CommandHandler(UserLogoutCommand)
export class UserLogoutUseCase implements ICommandHandler<UserLogoutCommand> {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly commandBus: CommandBus,
  ) {}

  async execute(command: UserLogoutCommand) {
    const { device } = command;

    const { userId, deviceId } = device;
    await this.commandBus.execute(new DeleteDeviceCommand(userId, deviceId));

    const user = await this.usersRepository.getUserById(userId);
    user.updateRefreshToken(null);
    await this.usersRepository.save(user);
  }
}
