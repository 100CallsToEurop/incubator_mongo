import { Types } from 'mongoose';

export interface ISecurityDevice {
  _id?: Types.ObjectId;
  iat: string;
  exp: string;
  deviceId: string;
  ip: string;
  user_agent: string;
  userId: string;
}
