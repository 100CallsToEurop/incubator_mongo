import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { ISecutityDevices } from '../interfaces/security-devices.interface';

@Schema({ collection: 'security-devices' })
export class SecurityDevice extends Document implements ISecutityDevices {
  @Prop({ required: true, type: String })
  iat: string;
  @Prop({ required: true, type: String })
  exp: string;
  @Prop({ required: true, type: String })
  deviceId: string;
  @Prop({ required: true, type: String })
  ip: string;
  @Prop({ required: true, type: String })
  user_agent: string;
  @Prop({ required: true, type: String })
  userId: string;
}
export const SecutityDeviceSchema = SchemaFactory.createForClass(SecurityDevice);
