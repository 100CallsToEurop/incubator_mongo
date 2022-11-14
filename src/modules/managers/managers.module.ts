import { Module } from '@nestjs/common';
import { MailerModule } from '@nestjs-modules/mailer';
import { EmailTemplatesManager } from './application/managers.service';
@Module({
  imports: [MailerModule],
  providers: [EmailTemplatesManager],
  exports: [EmailTemplatesManager],
})
export class ManagersModule {}
