import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { Logger, ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { CONSTANT } from './common/constant';
import { LoggingInterceptor } from './interceptor/logging.interceptor';
import { APP_CONFIG } from 'config/configuration';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
  app.enableCors();
  app.setGlobalPrefix(`api/${CONSTANT.API_VERSION}`);
  app.useLogger(app.get(WINSTON_MODULE_NEST_PROVIDER));
  const config = new DocumentBuilder()
    .setTitle('SONNY QUIVIO')
    .setDescription('Sonny quivio API Documentation')
    .setVersion('1.0.0')
    .addTag('SONNY')
    .addApiKey(
      {
        type: 'apiKey',
        in: 'header',
        name: 'Authorization',
      },
      'basic',
    )
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  // Use the LoggingInterceptor globally to log responses
  app.useGlobalInterceptors(new LoggingInterceptor(app.get(Logger)));
  await app.listen(APP_CONFIG.localhostPort);
}
bootstrap();
