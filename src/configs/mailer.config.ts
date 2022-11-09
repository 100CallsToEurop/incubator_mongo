import { EjsAdapter } from '@nestjs-modules/mailer/dist/adapters/ejs.adapter';
import { MailerAsyncOptions } from '@nestjs-modules/mailer/dist/interfaces/mailer-async-options.interface';
import { ConfigModule, ConfigService } from '@nestjs/config';

export const getMailerConfig = (): MailerAsyncOptions => {
  return {
    useFactory: (configService: ConfigService) => ({
      transport: getMailerString(configService),
      defaults: {
        from: configService.get('MAIL_FROM_NAME'),
      },
      template: {
        adapter: new EjsAdapter(),
        options: {
          strict: false,
        },
      },
    }),
    inject: [ConfigService],
    imports: [ConfigModule],
  };
};

const getMailerString = (configService: ConfigService) =>
'smtps://' +
configService.get('MAIL_USERNAME') +
'@' + 
configService.get('MAIL_HOST') +
':' +
configService.get('MAIL_PASSWORD') +
'.' + 
configService.get('MAIL_HOST')

