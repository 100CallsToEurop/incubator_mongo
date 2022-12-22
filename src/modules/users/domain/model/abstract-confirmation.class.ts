import { v4 as uuidv4 } from 'uuid';
import { add } from 'date-fns';
import { IConfirmation } from '../interfaces/abstract.confirmation.interface';
import { Document } from 'mongoose';

export abstract class Confirmation extends Document implements IConfirmation {
  protected confirmationCode: string;
  protected expirationDate: Date
  protected isConfirmed: boolean;

  public setConfirmationCode(): void {
    this.confirmationCode = uuidv4();
  }

  public getConfirmationCode(): string {
    return this.confirmationCode;
  }

  public setExpirationDate(): void {
    this.expirationDate = add(new Date(), {
      hours: 1,
      minutes: 3,
    });
  }

  public getExpirationDate(): Date {
    return this.expirationDate;
  }

  public setIsConfirmed(confirmed: boolean): void {
    this.isConfirmed = confirmed;
  }

  public getIsConfirmed(): boolean {
    return this.isConfirmed;
  }

  public checkEmailConfirmation(code: string): boolean {
    return (
      this.isConfirmed ||
      this.confirmationCode !== code ||
      this.expirationDate < new Date()
    );
  }

}
