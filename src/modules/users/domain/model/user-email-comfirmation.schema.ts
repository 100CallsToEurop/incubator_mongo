import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { IEmailConfirmation } from '../interfaces/user.interface';
import { Confirmation } from './abstract-confirmation.class';

export type UserEmailConfirmationDocument =
  HydratedDocument<UserEmailConfirmation>;

@Schema({ collection: 'users-confirmation' })
export class UserEmailConfirmation
  extends Confirmation
  implements IEmailConfirmation
{
  @Prop({ required: true, type: String })
  protected confirmationCode: string;
  @Prop({ required: true, type: Date })
  protected expirationDate: Date;
  @Prop({ required: true, type: Boolean, default: false })
  protected isConfirmed: boolean;
}
export const UserEmailConfirmationSchema = SchemaFactory.createForClass(
  UserEmailConfirmation,
);
UserEmailConfirmationSchema.methods.setConfirmationCode =
  UserEmailConfirmation.prototype.setConfirmationCode;
UserEmailConfirmationSchema.methods.getConfirmationCode =
  UserEmailConfirmation.prototype.getConfirmationCode;
UserEmailConfirmationSchema.methods.setExpirationDate =
  UserEmailConfirmation.prototype.setExpirationDate;
UserEmailConfirmationSchema.methods.getExpirationDate =
  UserEmailConfirmation.prototype.getExpirationDate;
UserEmailConfirmationSchema.methods.setIsConfirmed =
  UserEmailConfirmation.prototype.setIsConfirmed;
UserEmailConfirmationSchema.methods.getIsConfirmed =
  UserEmailConfirmation.prototype.getIsConfirmed;
UserEmailConfirmationSchema.methods.checkEmailConfirmation =
  UserEmailConfirmation.prototype.checkEmailConfirmation;

  
