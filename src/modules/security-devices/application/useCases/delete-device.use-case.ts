import { NotFoundException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs/dist';
import { SecurityDevicesRepository } from '../../infrastructure/security-devices.repository';

export class DeleteDeviceCommand {
  constructor(public userId: string, public deviceId: string) {}
}

@CommandHandler(DeleteDeviceCommand)
export class DeleteDeviceUseCase
  implements ICommandHandler<DeleteDeviceCommand>
{
  constructor(
    private readonly securityDevicesRepository: SecurityDevicesRepository,
  ) {}

  async execute(command: DeleteDeviceCommand): Promise<void> {
    const { userId, deviceId } = command;
    const result =
      await this.securityDevicesRepository.deleteSecurityDeviceById(
        deviceId,
        userId,
      );
    if (!result) {
      throw new NotFoundException();
    }
  }
}
