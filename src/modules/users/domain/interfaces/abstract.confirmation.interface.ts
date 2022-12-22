export interface IConfirmation {
  setConfirmationCode(): void;
  getConfirmationCode(): string;
  setExpirationDate(): void;
  getExpirationDate(): Date;
  setIsConfirmed(confirmed: boolean): void;
  getIsConfirmed(): boolean;
  checkEmailConfirmation(code: string): boolean;
}
