import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, HydratedDocument } from 'mongoose';
import { ISession, ISessionEntity } from '../interfaces/user.interface';

export type SessionDocument = HydratedDocument<Session>;

@Schema({ collection: 'users-sessions' })
export class Session extends Document implements ISessionEntity {
  @Prop({ required: false })
  public refreshToken: string = null;
  @Prop({ required: false })
  public badTokens: Array<string> = [];

  public setRefreshToken(refreshToken: string): void {
    this.refreshToken = refreshToken;
  }

  public getRefreshToken(): string {
    return this.refreshToken;
  }

  public setBadToken(badTokens: string): void {
    this.badTokens.push(badTokens);
  }

  public getBadTokens(): Array<string> {
    return this.badTokens;
  }
}
export const SessionSchema = SchemaFactory.createForClass(Session);
SessionSchema.methods.setRefreshToken = Session.prototype.setRefreshToken;
SessionSchema.methods.getRefreshToken = Session.prototype.getRefreshToken;
SessionSchema.methods.setBadToken = Session.prototype.setBadToken;
SessionSchema.methods.getBadTokens = Session.prototype.getBadTokens;
