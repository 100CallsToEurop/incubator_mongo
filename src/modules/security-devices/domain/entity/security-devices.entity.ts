import { Types } from "mongoose";
import { DeviceInputModel } from "../../api/models/security-devices.model";
import { ISecutityDevices } from "../interfaces/security-devices.interface";

export class SecurityDeviceEntity implements ISecutityDevices {
  _id?: Types.ObjectId;
  iat: string;
  exp: string;
  deviceId: string;
  ip: string;
  user_agent: string;
  userId: string;

  constructor(device: DeviceInputModel, payload: any) {
     this._id = new Types.ObjectId();
     this.ip = device.ip
     this.user_agent = device.user_agent
     this.iat = payload.iat;
     this.exp = payload.exp;
     this.deviceId = payload.deviceId;
     this.userId = payload.userId;
  }
}