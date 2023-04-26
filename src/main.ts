import { NestFactory } from '@nestjs/core';
import * as cookieParser from 'cookie-parser';
//import cookieParser from 'cookie-parser';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './modules/app.module';
import { useContainer } from 'class-validator';
import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';

import { HttpExceptionFilter } from './common/exceptions/exceptions.filter';

const getCorsOptions = (origin: string[]): CorsOptions => ({
  origin,
  credentials: true,
});

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService);

  app.setGlobalPrefix('api');
  app.useGlobalFilters(new HttpExceptionFilter());
  const port = configService.get('PORT') || 5000;
  app.use(cookieParser());

  const apiSettings = configService.get('apiSettings', { infer: true });
  //const origin = [apiSettings.LOCAL_HOST, apiSettings.LOCAL_HOST2];
  app.enableCors(/*getCorsOptions(origin)*/);

  app.useGlobalPipes(
    new ValidationPipe({
      /* whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
      transformOptions: {
        enableImplicitConversion: true,
      },*/
    }),
  );

  useContainer(app.select(AppModule), {
    fallbackOnErrors: true,
  });

  await app.listen(port, () => {
    console.log(`Server started on port: ${port}`);
  });
}
bootstrap();
