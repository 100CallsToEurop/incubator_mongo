import { CommandHandler } from '@nestjs/cqrs';
import { ICommandHandler } from '@nestjs/cqrs/dist';
import { SecurityDeviceEntity } from '../../domain/entity/security-devices.entity';
import { ISecurityDevice } from '../../domain/interfaces/security-devices.interface';
import { SecurityDevicesRepository } from '../../infrastructure/security-devices.repository';


export class UpdateDeviceCommand {
  constructor(public newUserSessionDevice: ISecurityDevice) {}
}

@CommandHandler(UpdateDeviceCommand)
export class UpdateDeviceUseCase
  implements ICommandHandler<UpdateDeviceCommand>
{
  constructor(
    private readonly securityDevicesRepository: SecurityDevicesRepository,
  ) {}

  async execute(command: UpdateDeviceCommand): Promise<void> {
    const { newUserSessionDevice } = command;
    const newDeviceEntity = new SecurityDeviceEntity(newUserSessionDevice);
    await this.securityDevicesRepository.updateSecurityDevice(newDeviceEntity);
  }
}
