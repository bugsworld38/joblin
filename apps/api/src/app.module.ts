import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';

import { ApplicationModule } from '@application';
import { AuthModule } from '@auth';
import {
  appConfig,
  authConfig,
  databaseConfig,
  envValidationSchema,
  swaggerConfig,
} from '@config';
import { DatabaseModule } from '@database';
import { HealthModule } from '@health';
import { RefreshTokenModule } from '@refresh-token';
import { ScraperModule } from '@scraper';
import { UserModule } from '@user';
import { VacancyModule } from '@vacancy';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [appConfig, authConfig, databaseConfig, swaggerConfig],
      validationSchema: envValidationSchema,
      validationOptions: {
        abortEarly: false,
      },
      cache: true,
    }),
    ThrottlerModule.forRoot({
      throttlers: [{ ttl: 60000, limit: 60 }],
    }),
    DatabaseModule,
    HealthModule,
    UserModule,
    AuthModule,
    RefreshTokenModule,
    VacancyModule,
    ApplicationModule,
    ScraperModule,
  ],
  providers: [{ provide: APP_GUARD, useClass: ThrottlerGuard }],
})
export class AppModule {}
