import { Module } from '@nestjs/common';
import { MailerModule } from '@nestjs-modules/mailer';
import { EmailTemplatesManager } from './application/managers.service';
import { SendMessageToEmailUseCase } from './application/useCases/sendMessageToEmail.use-case';
import { CqrsModule } from '@nestjs/cqrs';

const useCases = [SendMessageToEmailUseCase];
@Module({
  imports: [CqrsModule, MailerModule],
  providers: [EmailTemplatesManager, ...useCases],
  exports: [...useCases],
})
export class ManagersModule {}
