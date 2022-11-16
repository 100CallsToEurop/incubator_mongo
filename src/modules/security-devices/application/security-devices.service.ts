import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { Types } from 'mongoose';
import { TokensService } from '../../../modules/tokens/application/tokens.service';
import { DeviceInputModelPayload } from '../api/models';
import { DeviceInputModel } from '../api/models/security-devices.model';
import { SecurityDeviceEntity } from '../domain/entity/security-devices.entity';
import { ISecutityDevices } from '../domain/interfaces/security-devices.interface';
import { SecurityDeviceInputModel } from '../infrastructure/dto/security-devices.input-model';
import { SecurityDevicesRepository } from '../infrastructure/security-devices.repository';
import { DeviceViewModel } from './dto/security-devices.view-model';

@Injectable()
export class SecurityDevicesService {
  constructor(
    private readonly tokensService: TokensService,
    private readonly securityDevicesRepository: SecurityDevicesRepository,
  ) {}

  buildResponseDevice(device: ISecutityDevices): DeviceViewModel {
    return {
      ip: device.ip,
      title: device.user_agent,
      lastActiveDate: new Date(+device.iat * 1000).toISOString(),
      deviceId: device.deviceId,
    };
  }

  async createDevice(
    device: DeviceInputModel,
    payload: DeviceInputModelPayload,
    userId: string,
  ): Promise<void> {
    const newDeviceEntity = new SecurityDeviceEntity(device, payload, userId);
    await this.securityDevicesRepository.createSecurityDevice(newDeviceEntity);
  }

  async updateDevice(
    id: Types.ObjectId,
    device: SecurityDeviceInputModel,
  ): Promise<void> {
    await this.securityDevicesRepository.updateSecurityDeviceById(id, device);
  }

  async getAllDevices(
    device: DeviceInputModel,
    refreshToken?: string,
  ): Promise<DeviceViewModel[] | any> {
    const { deviceId, userId } = await this.tokensService.decodeToken(refreshToken);
   console.log(deviceId);
   console.log(userId);
    const devices = await this.securityDevicesRepository.getSecurityDevices(
      device.ip,
      deviceId,
      userId,
    );
    if (devices.length > 0)
      return devices.map((d) => this.buildResponseDevice(d));
    return {
      ObjectContaining: {
        deviceId: devices[0].deviceId,
      },
    };
  }

  async deleteDevice(
    deviceIdReq: string,
    device: DeviceInputModel,
    refreshToken?: string,
  ): Promise<void> {

    const { deviceId, userId } = await this.tokensService.decodeToken(refreshToken);
    if (deviceIdReq !== deviceId) {
      throw new UnauthorizedException();
    }
      const result =
        await this.securityDevicesRepository.deleteSecurityDeviceById(
          deviceIdReq,
          device.ip,
          userId,
        );
    if (!result) {
      throw new NotFoundException();
    }
  }

  async deleteAllDevice(
    device: DeviceInputModel,
    refreshToken?: string,
  ): Promise<void> {
    const { deviceId, userId } = await this.tokensService.decodeToken(
      refreshToken,
    );
    await this.securityDevicesRepository.deleteAllSecurityDeviceById(
      device.ip,
      deviceId,
      userId
    );
  }
}
