import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, HydratedDocument } from 'mongoose';
import { ISession } from '../interfaces/user.interface';

export type SessionDocument = HydratedDocument<Session>;

@Schema({ collection: 'users-sessions' })
export class Session extends Document implements ISession {
  @Prop({ required: false })
  private refreshToken: string = null;
  @Prop({ required: false })
  private badTokens: Array<string> = [];

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
