import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';
import { NestFactory, Reflector } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import cookieParser from 'cookie-parser';
import helmet from 'helmet';

import {
  AppConfig,
  SwaggerConfig,
  appConfig,
  swaggerConfig,
} from '@core/config';

import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = app.get<AppConfig>(appConfig.KEY);
  const swagger = app.get<SwaggerConfig>(swaggerConfig.KEY);

  if (swagger.enabled) {
    setupSwagger(app, swagger);
  }

  app.useGlobalInterceptors(
    new ClassSerializerInterceptor(app.get(Reflector), {
      excludeExtraneousValues: true,
    }),
  );

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  app.use(helmet());
  app.use(cookieParser());
  app.enableShutdownHooks();
  app.enableCors({
    origin: 'http://localhost:5173',
    credentials: true,
  });

  await app.listen(config.port);
}

void bootstrap();

function setupSwagger(
  app: Awaited<ReturnType<typeof NestFactory.create>>,
  config: SwaggerConfig,
) {
  const documentConfig = new DocumentBuilder()
    .setTitle(config.title)
    .setDescription(config.description)
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'Authorization',
        description: 'Enter JWT token',
        in: 'header',
      },
      'jwt',
    )
    .build();

  const document = SwaggerModule.createDocument(app, documentConfig, {
    operationIdFactory: (_: string, methodKey: string) => methodKey,
  });

  SwaggerModule.setup(config.path, app, document, {
    swaggerOptions: {
      persistAuthorization: true,
    },
  });
}
