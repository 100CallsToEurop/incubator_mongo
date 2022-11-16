import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
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

  async getSecurityDevices(
    ip: string,
    deviceId: string,
    userId: string
  ): Promise<ISecutityDevices[]> {
    return await this.securityDeviceModel.find({ ip, deviceId, userId });
  }

  async updateSecurityDeviceById(
    _id: Types.ObjectId,
    update: SecurityDeviceInputModel,
  ): Promise<boolean> {
    const securityDeviceUpdate = await this.securityDeviceModel
      .findOneAndUpdate({ _id }, update)
      .exec();
    return securityDeviceUpdate ? true : false;
  }

  async deleteSecurityDeviceById(
    deviceId: string,
    ip: string,
    userId: string,
  ): Promise<boolean> {
    const securityDeviceDelete = await this.securityDeviceModel
      .findOneAndDelete({ deviceId, ip, userId })
      .exec();
    return securityDeviceDelete ? true : false;
  }

  async deleteAllSecurityDeviceById(
    ip: string,
    deviceId: string,
    userId: string,
  ): Promise<boolean> {
    const securityDeviceDelete = await this.securityDeviceModel
      .deleteMany({ ip, deviceId, userId })
      .exec();
    return securityDeviceDelete ? true : false;
  }
}