import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, HydratedDocument } from 'mongoose';
import { IAccountEntity, IBanInfo } from '../interfaces/user.interface';
import * as bcrypt from 'bcrypt';
import { UserInputModel } from '../../api/models';

export type UserAccountDocument = HydratedDocument<UserAccount>;

@Schema({ collection: 'users-account-ban' })
export class BanInfo extends Document implements IBanInfo {
  @Prop({ required: false, type: Boolean })
  isBanned: boolean;
  @Prop({ required: false, type: Date })
  banDate: Date;
  @Prop({ required: false, type: String })
  banReason: string;
}
export const BanInfoSchema = SchemaFactory.createForClass(BanInfo);


@Schema({ collection: 'users-account' })
export class UserAccount extends Document implements IAccountEntity {
  @Prop({ required: true })
  login: string;
  @Prop({ required: true })
  email: string;
  @Prop({ required: true })
  passwordHash: string;
  @Prop({ required: true, type: Date })
  createdAt: Date;
  @Prop({ required: false, type: BanInfoSchema })
  banInfo: IBanInfo;

  public async isPasswordCorrect(password: string, hash: string) {
    const isEqual = await bcrypt.compare(password, hash);
    return isEqual;
  }

  public setLogin(login: string): void {
    this.login = login;
  }

  public getLogin(): string {
    return this.login;
  }

  public setEmail(email: string): void {
    this.email = email;
  }

  public getEmail(): string {
    return this.email;
  }

  public getBanInfo(): IBanInfo {
    return this.banInfo;
  }

  public setBanInfo(isBanned: boolean, banDate: Date, banReason: string): void{
     this.banInfo = {
       isBanned,
       banDate,
       banReason
     };
  }

  public async setPasswordHash(password: string): Promise<void> {
    const passwordHash = await bcrypt.hash(password, 10);
    this.passwordHash = passwordHash;
  }

  public getPasswordHash(): string {
    return this.passwordHash;
  }

  public setCreatedAt(): void {
    this.createdAt = new Date();
  }

  public getCreatedAt(): Date {
    return this.createdAt;
  }

  public getBanStatus(): boolean{
    return this.banInfo.isBanned
  }

  public async checkPassword(password: string): Promise<boolean> {
    return await this.isPasswordCorrect(password, this.passwordHash);
  }

  public async createAccountUser(createParams: UserInputModel) {
    this.setEmail(createParams.email);
    this.setLogin(createParams.login);
    await this.setPasswordHash(createParams.password);
    this.setCreatedAt();
  }
}
export const UserAccountSchema = SchemaFactory.createForClass(UserAccount);
UserAccountSchema.methods.getBanInfo = UserAccount.prototype.getBanInfo;
UserAccountSchema.methods.setBanInfo = UserAccount.prototype.setBanInfo; 
UserAccountSchema.methods.checkPassword = UserAccount.prototype.checkPassword;
UserAccountSchema.methods.setLogin = UserAccount.prototype.setLogin;
UserAccountSchema.methods.getLogin = UserAccount.prototype.getLogin;
UserAccountSchema.methods.setEmail = UserAccount.prototype.setEmail;
UserAccountSchema.methods.getEmail = UserAccount.prototype.getEmail;
UserAccountSchema.methods.setPasswordHash =
  UserAccount.prototype.setPasswordHash;
UserAccountSchema.methods.getPasswordHash =
  UserAccount.prototype.getPasswordHash;
UserAccountSchema.methods.getCreatedAt = UserAccount.prototype.getCreatedAt;
UserAccountSchema.methods.setCreatedAt = UserAccount.prototype.setCreatedAt;
UserAccountSchema.methods.createAccountUser =
  UserAccount.prototype.createAccountUser;
UserAccountSchema.methods.isPasswordCorrect =
  UserAccount.prototype.isPasswordCorrect;

  UserAccountSchema.methods.getBanStatus = UserAccount.prototype.getBanStatus;

