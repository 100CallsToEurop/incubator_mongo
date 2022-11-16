import { Types } from 'mongoose';

export interface ISecutityDevices {
  _id?: Types.ObjectId;
  iat: string;
  exp: string;
  deviceId: string;
  ip: string;
  user_agent: string;
  userId: string;
}
