import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { SecurityDeviceEntity } from '../entity/security-devices.entity';
import {
  ISecurityDevice,
  SecurityDeviceDocument,
  SecurityDeviceModelType,
  SecurityDeviceStaticType,
} from '../interfaces/security-devices.interface';

@Schema({ collection: 'security-devices' })
export class SecurityDevice extends Document implements ISecurityDevice {
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

  public setIat(iat: string): void {
    this.iat = iat;
  }
  public setExp(exp: string): void {
    this.exp = exp;
  }
  public setDeviceId(deviceId: string): void {
    this.deviceId = deviceId;
  }
  public setIp(ip: string): void {
    this.ip = ip;
  }
  public setUser_agent(user_agent: string): void {
    this.user_agent = user_agent;
  }
  public setUserId(userId: string): void {
    this.userId = userId;
  }

  public getIat(): string {
    return this.iat;
  }
  public getExp(): string {
    return this.exp;
  }
  public getDeviceId(): string {
    return this.deviceId;
  }
  public getIp(): string {
    return this.ip;
  }
  public getUser_agent(): string {
    return this.user_agent;
  }
  public getUserId(): string {
    return this.userId;
  }

  public updateDevice(updateDeviceParams: SecurityDeviceEntity): void {
     this.setIat(updateDeviceParams.iat);
     this.setExp(updateDeviceParams.exp);
     this.setDeviceId(updateDeviceParams.deviceId);
     this.setIp(updateDeviceParams.ip);
     this.setUser_agent(updateDeviceParams.user_agent);
     this.setUserId(updateDeviceParams.userId);
  }

  public static createDevice(
    newSecurityDeviceEntity: SecurityDeviceEntity,
    SecurityDeviceModel: SecurityDeviceModelType,
  ): SecurityDeviceDocument {
    const newSecurityDevice = new SecurityDeviceModel(newSecurityDeviceEntity);
    return newSecurityDevice;
  }
}
export const SecutityDeviceSchema =
  SchemaFactory.createForClass(SecurityDevice);

const securityDeviceStaticMethod: SecurityDeviceStaticType = {
  createDevice: SecurityDevice.createDevice,
};
SecutityDeviceSchema.statics = securityDeviceStaticMethod;

SecutityDeviceSchema.methods.setIat = SecurityDevice.prototype.setIat;
SecutityDeviceSchema.methods.setExp = SecurityDevice.prototype.setExp;
SecutityDeviceSchema.methods.setDeviceId = SecurityDevice.prototype.setDeviceId;
SecutityDeviceSchema.methods.setIp = SecurityDevice.prototype.setIp;
SecutityDeviceSchema.methods.setUser_agent =
  SecurityDevice.prototype.setUser_agent;
SecutityDeviceSchema.methods.setUserId = SecurityDevice.prototype.setUserId;

SecutityDeviceSchema.methods.getIat = SecurityDevice.prototype.getIat;
SecutityDeviceSchema.methods.getExp = SecurityDevice.prototype.getExp;
SecutityDeviceSchema.methods.getDeviceId = SecurityDevice.prototype.getDeviceId;
SecutityDeviceSchema.methods.getIp = SecurityDevice.prototype.getIp;
SecutityDeviceSchema.methods.getUser_agent =
  SecurityDevice.prototype.getUser_agent;
SecutityDeviceSchema.methods.getUserId = SecurityDevice.prototype.getUserId;
SecutityDeviceSchema.methods.updateDevice =
  SecurityDevice.prototype.updateDevice;

