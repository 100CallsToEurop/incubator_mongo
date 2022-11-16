import { Injectable, NotFoundException } from '@nestjs/common';
import { Types } from 'mongoose';
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

  async getAllDevices(ip: string): Promise<DeviceViewModel[]> {
    const devices = await this.securityDevicesRepository.getSecurityDevices(
      ip,
    );
    return devices.map((d) => this.buildResponseDevice(d));
  }

  async deleteDevice(id: Types.ObjectId, ip: string): Promise<void> {
    const result =
      await this.securityDevicesRepository.deleteSecurityDeviceById(id, ip);
    if (!result) {
      throw new NotFoundException();
    }
  }

  async deleteAllDevice(userId: string): Promise<void> {
    await this.securityDevicesRepository.deleteAllSecurityDeviceById(userId);
  }
}
