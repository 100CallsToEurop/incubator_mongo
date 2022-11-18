import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class EmailTemplatesManager {
  constructor(private readonly mailerService: MailerService) {}

  async sendEmailConfirmationMessage(email: string, confirmationCode: string) {
    const link = `Thank for your registration. To finish registration please follow the link below: <a href="https://somesite.com/confirm-email?code=${confirmationCode}">complete registration</a>"`;
    await this.mailerService.sendMail({
      to: email,
      html: link,
    });
  }

  async sendEmailPasswordRecoveryMessage(email: string, passwordRecoveryCode: string) {
    const link = `To finish password recovery please follow the link below: <a href="https://somesite.com/password-recovery?recoveryCode=${passwordRecoveryCode}">recovery password</a>"`;
    await this.mailerService.sendMail({
      to: email,
      html: link,
    });
  }
}
