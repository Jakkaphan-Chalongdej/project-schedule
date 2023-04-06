import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { NestExpressApplication } from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const config = app.get(ConfigService);
  app.setGlobalPrefix(config.get<string>('app.prefixApi'));
  const options = new DocumentBuilder()
    .setTitle('Schedule Project')
    .setDescription('API endpoints for Schedule Project')
    .setVersion('1.0')
    .addBearerAuth({ in: 'headers', type: 'http' })
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('api/docs', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
    },
  });
  app.useGlobalPipes(
    new ValidationPipe({
      disableErrorMessages: config.get<boolean>('app.isProduction'),
      transform: true,
    }),
  );
  app.enableCors({
    credentials: true,
    origin: (origin, callback) => {
      return callback(null, true);
    },
    methods: 'GET,PUT,PATCH,POST,DELETE',
  });

  await app.listen(config.get<number>('app.port'));
  console.log(`Application is running on: ${await app.getUrl()}/api/docs`);
}
bootstrap();
