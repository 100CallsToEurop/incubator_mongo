import { Injectable } from "@nestjs/common/decorators";
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class SendMessageToEmailUseCase {
  constructor(private readonly mailerService: MailerService) {}

  async execute(email: string, link: string) {
    await this.mailerService.sendMail({
      to: email,
      html: link,
    });
  }
}