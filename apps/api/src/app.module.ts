import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';

import { AuthModule } from '@core/auth/auth.module';
import {
  appConfig,
  authConfig,
  databaseConfig,
  envValidationSchema,
  swaggerConfig,
} from '@core/config';
import { DatabaseModule } from '@core/database/database.module';
import { HealthModule } from '@core/health/health.module';
import { ApplicationsModule } from '@modules/applications/applications.module';
import { RefreshTokensModule } from '@modules/refresh-tokens/refresh-tokens.module';
import { ScraperModule } from '@modules/scraper/scraper.module';
import { UsersModule } from '@modules/users/users.module';
import { VacanciesModule } from '@modules/vacancies/vacancies.module';

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
    UsersModule,
    AuthModule,
    RefreshTokensModule,
    VacanciesModule,
    ApplicationsModule,
    ScraperModule,
  ],
  providers: [{ provide: APP_GUARD, useClass: ThrottlerGuard }],
})
export class AppModule {}
