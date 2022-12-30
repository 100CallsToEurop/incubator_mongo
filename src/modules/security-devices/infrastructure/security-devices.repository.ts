import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { SecurityDeviceEntity } from '../domain/entity/security-devices.entity';
import { ISecurityDevice, SecurityDeviceDocument } from '../domain/interfaces/security-devices.interface';
import { SecurityDevice } from '../domain/model/security-devices.schema';

@Injectable()
export class SecurityDevicesRepository {
  constructor(
    @InjectModel(SecurityDevice.name)
    private readonly securityDeviceModel: Model<SecurityDeviceDocument>,
  ) {}

  async save(model: SecurityDeviceDocument) {
    return await model.save();
  }

  async createSecurityDevice(
    SecurityDevice: SecurityDeviceEntity,
  ): Promise<ISecurityDevice> {
    const newSecurityDevice = new this.securityDeviceModel(SecurityDevice);
    return await newSecurityDevice.save();
  }

  async updateSecurityDevice(
    update: ISecurityDevice,
  ): Promise<ISecurityDevice | boolean> {
    const device = await this.securityDeviceModel.findOne({
      deviceId: update.deviceId,
    });
    if (!device) {
      return this.createSecurityDevice(update);
    }
    const { _id, ...updateParams } = update;
    const securityDeviceUpdate = await this.securityDeviceModel
      .updateOne({ deviceId: update.deviceId }, updateParams)
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

  async getSecurityDevicesByDeviceId(
    deviceId: string,
  ): Promise<SecurityDeviceDocument> {
    return await this.securityDeviceModel.findOne({ deviceId });
  }

  async getSecurityDevicesByUserId(
    userId: string,
  ): Promise<SecurityDeviceDocument> {
    return await this.securityDeviceModel.findOne({ userId });
  }
}
