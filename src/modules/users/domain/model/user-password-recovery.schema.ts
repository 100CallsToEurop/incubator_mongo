import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { IPasswordRecovery } from '../interfaces/user.interface';
import { Confirmation } from './abstract-confirmation.class';

export type UserPasswordRecoveryDocument =
  HydratedDocument<UserPasswordRecovery>;

@Schema({ collection: 'users-password-recovery' })
export class UserPasswordRecovery
  extends Confirmation
  implements IPasswordRecovery
{
  @Prop({ required: true, type: String })
  protected confirmationCode: string;
  @Prop({ required: true, type: Date })
  protected expirationDate: Date;
  @Prop({ required: true, type: Boolean, default: false })
  protected isConfirmed: boolean;
}

export const UserPasswordRecoverySchema =
  SchemaFactory.createForClass(UserPasswordRecovery);

UserPasswordRecoverySchema.methods.setConfirmationCode =
  UserPasswordRecovery.prototype.setConfirmationCode;
UserPasswordRecoverySchema.methods.getConfirmationCode =
  UserPasswordRecovery.prototype.getConfirmationCode;
UserPasswordRecoverySchema.methods.setExpirationDate =
  UserPasswordRecovery.prototype.setExpirationDate;
UserPasswordRecoverySchema.methods.getExpirationDate =
  UserPasswordRecovery.prototype.getExpirationDate;
UserPasswordRecoverySchema.methods.setIsConfirmed =
  UserPasswordRecovery.prototype.setIsConfirmed;
UserPasswordRecoverySchema.methods.getIsConfirmed =
  UserPasswordRecovery.prototype.getIsConfirmed;

