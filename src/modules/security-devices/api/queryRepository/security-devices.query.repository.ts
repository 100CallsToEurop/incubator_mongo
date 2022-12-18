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
    deviceId: string,
    userId: string,
  ): Promise<ISecurityDevice[]> {
    return await this.securityDeviceModel.find({ deviceId, userId });
  }

  async findAllUserDevices(
    userId: string,
    deviceId?: string,
  ): Promise<DeviceViewModel[] | any[]> {
    const devices = await this.getSecurityDevices(
      userId,
    );
    if (devices.length > 0)
      return devices.map((d) =>
        this.buildResponseDevice(d),
      );
    return [{ deviceId }];
  }
}
