import { Types } from "mongoose";
import { DeviceInputModel } from "../../api/models/security-devices.model";
import { ISecurityDevice } from '../interfaces/security-devices.interface';

export class SecurityDeviceEntity implements ISecurityDevice {
  _id?: Types.ObjectId;
  iat: string;
  exp: string;
  deviceId: string;
  ip: string;
  user_agent: string;
  userId: string;

  constructor(session: ISecurityDevice) {
    this._id = new Types.ObjectId();
    this.ip = session.ip;
    this.user_agent = session.user_agent;
    this.iat = session.iat;
    this.exp = session.exp;
    this.deviceId = session.deviceId;
    this.userId = session.userId;
  }
}