import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ObjectId } from 'mongodb';
import { Model, Types } from 'mongoose';
import { DeviceInputModel } from '../api/models';
import { SecurityDeviceEntity } from '../domain/entity/security-devices.entity';
import { ISecutityDevices } from '../domain/interfaces/security-devices.interface';
import { SecurityDevice } from '../domain/model/security-devices.schema';
import { SecurityDeviceInputModel } from './dto/security-devices.input-model';

@Injectable()
export class SecurityDevicesRepository {
  constructor(
    @InjectModel(SecurityDevice.name)
    private readonly securityDeviceModel: Model<SecurityDevice>,
  ) {}

  async createSecurityDevice(
    SecurityDevice: SecurityDeviceEntity,
  ): Promise<ISecutityDevices> {
    const newSecurityDevice = new this.securityDeviceModel(SecurityDevice);
    return await newSecurityDevice.save();
  }

  async getSecurityDeviceById(_id: Types.ObjectId): Promise<ISecutityDevices> {
    return await this.securityDeviceModel.findOne({ _id }).exec();
  }

  async getSecurityDevices(userId: string): Promise<ISecutityDevices[]> {
    return await this.securityDeviceModel.find({ userId });
  }

  async getSecurityDevicesByDeviceId(
    deviceId: string,
  ): Promise<ISecutityDevices[]> {
    return await this.securityDeviceModel.find({ deviceId });
  }

  async getSecurityDevicesByDeviceIdAndUserId(
    deviceId: string,
    userId: string,
  ): Promise<ISecutityDevices[]> {
    return await this.securityDeviceModel.find({ deviceId, userId });
  }

  async getSecurityDeviceByDevice(
    device: DeviceInputModel,
    userId: string,
  ): Promise<ISecutityDevices> {
    return await this.securityDeviceModel.findOne({
      ip: device.ip,
      user_agent: device.user_agent,
      userId,
    });
  }

  async updateSecurityDeviceById(
    update: SecurityDeviceInputModel,
  ): Promise<boolean> {
    const securityDeviceUpdate = await this.securityDeviceModel
      .updateOne({ deviceId: update.deviceId }, update)
      .exec();

    return securityDeviceUpdate ? true : false;
  }

  async deleteSecurityDeviceById(
    deviceId: string,
    userId: string,
  ): Promise<boolean> {
    const securityDeviceDelete = await this.securityDeviceModel
      .findOneAndDelete({ deviceId, userId })
      .exec();
    return securityDeviceDelete ? true : false;
  }

  async deleteAllSecurityDeviceById(userId: string): Promise<boolean> {
    const securityDeviceDelete = await this.securityDeviceModel
      .find({ userId })
      .remove()
      .exec();
    return securityDeviceDelete ? true : false;
  }

  async deleteAllSecurityDeviceByDeviceId(
    deviceId: string,
  ): Promise<ISecutityDevices> {
    return await this.securityDeviceModel.findOne({ deviceId }).exec();
  }
}
