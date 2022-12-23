import { HydratedDocument, Model, Types } from 'mongoose';
import { SecurityDeviceEntity } from '../entity/security-devices.entity';
import { SecurityDevice } from '../model/security-devices.schema';

export interface ISecurityDevice {
  _id?: Types.ObjectId;
  iat: string;
  exp: string;
  deviceId: string;
  ip: string;
  user_agent: string;
  userId: string;
}

export type SecurityDeviceDocument = HydratedDocument<SecurityDevice>;

export type SecurityDeviceStaticType = {
  createDevice: (
    newSecurityDevice: SecurityDeviceEntity,
    SecurityDeviceModel: SecurityDeviceModelType,
  ) => SecurityDeviceDocument;
};

export type SecurityDeviceModelType = Model<SecurityDeviceDocument> &
  SecurityDeviceStaticType;
