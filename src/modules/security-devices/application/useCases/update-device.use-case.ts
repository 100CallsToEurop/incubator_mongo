import { CommandHandler } from '@nestjs/cqrs';
import { ICommandHandler } from '@nestjs/cqrs/dist';
import { InjectModel } from '@nestjs/mongoose';
import { SecurityDeviceEntity } from '../../domain/entity/security-devices.entity';
import {
  ISecurityDevice,
  SecurityDeviceModelType,
} from '../../domain/interfaces/security-devices.interface';
import { SecurityDevice } from '../../domain/model/security-devices.schema';
import { SecurityDevicesRepository } from '../../infrastructure/security-devices.repository';

export class UpdateDeviceCommand {
  constructor(public newUserSessionDevice: ISecurityDevice) {}
}

@CommandHandler(UpdateDeviceCommand)
export class UpdateDeviceUseCase
  implements ICommandHandler<UpdateDeviceCommand>
{
  constructor(
    @InjectModel(SecurityDevice.name)
    private readonly SecurityDeviceModel: SecurityDeviceModelType,
    private readonly securityDevicesRepository: SecurityDevicesRepository,
  ) {}

  async execute(command: UpdateDeviceCommand): Promise<void> {
    const { newUserSessionDevice } = command;
    const newDeviceEntity = new SecurityDeviceEntity(newUserSessionDevice);

    let securityDevice =
      await this.securityDevicesRepository.getSecurityDevicesByDeviceId(
        newUserSessionDevice.deviceId,
      );
    if (securityDevice) {
      securityDevice.updateDevice(newDeviceEntity);
    } else {
      securityDevice = this.SecurityDeviceModel.createDevice(
        newDeviceEntity,
        this.SecurityDeviceModel,
      );
    }
    await this.securityDevicesRepository.save(securityDevice);
  }
}
