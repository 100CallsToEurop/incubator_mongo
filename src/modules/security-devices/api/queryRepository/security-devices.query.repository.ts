import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { DeviceViewModel } from './dto/security-devices.view-model';
import { ISecurityDevice } from '../../domain/interfaces/security-devices.interface';
import { SecurityDevice } from '../../domain/model/security-devices.schema';

@Injectable()
export class SecurityDevicesQueryRepository {
  constructor(
    @InjectModel(SecurityDevice.name)
    private readonly securityDeviceModel: Model<SecurityDevice>,
  ) {}

  buildResponseDevice(device: ISecurityDevice): DeviceViewModel {
    return {
      ip: device.ip,
      title: device.user_agent,
      lastActiveDate: new Date(+device.iat * 1000).toISOString(),
      deviceId: device.deviceId,
    };
  }

  async getSecurityDevices(userId: string): Promise<ISecurityDevice[]> {
    return await this.securityDeviceModel.find({ userId });
  }

  async getSecurityDevicesByDeviceId(
    deviceId: string,
  ): Promise<ISecurityDevice> {
    return await this.securityDeviceModel.findOne({ deviceId });
  }

  async getSecurityDevicesByDeviceIdAndUserId(
    userId: string,
  ): Promise<ISecurityDevice[]> {
    return await this.securityDeviceModel.find({ userId });
  }

  async findAllUserDevices(userId: string): Promise<DeviceViewModel[]> {
    const devices = await this.getSecurityDevices(userId);
    return devices.map((d) => this.buildResponseDevice(d));
  }
}
