import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { SecurityDevicesRepository } from '../../infrastructure/security-devices.repository';

export class DeleteAllUserDevicesCommand {
  constructor(public userId: string) {}
}

@CommandHandler(DeleteAllUserDevicesCommand)
export class DeleteAllUserDevicesUseCase
  implements ICommandHandler<DeleteAllUserDevicesCommand>
{
  constructor(
    private readonly securityDevicesRepository: SecurityDevicesRepository,
  ) {}

  async execute(command: DeleteAllUserDevicesCommand): Promise<void> {
    const { userId } = command;
    await this.securityDevicesRepository.deleteAllSecurityDeviceById(userId);
  }
}
