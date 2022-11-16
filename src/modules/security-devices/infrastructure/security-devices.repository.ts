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

  async getSecurityDevices(userId: string): Promise<ISecutityDevices[]> {
    return await this.securityDeviceModel.find({ userId });
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
    _id: Types.ObjectId,
    userId: string,
  ): Promise<boolean> {
    const securityDeviceDelete = await this.securityDeviceModel
      .findOneAndDelete({ _id, userId })
      .exec();
    return securityDeviceDelete ? true : false;
  }

  async deleteAllSecurityDeviceById(userId: string): Promise<boolean> {
    const securityDeviceDelete = await this.securityDeviceModel
      .deleteMany({ userId })
      .exec();
    return securityDeviceDelete ? true : false;
  }
}
