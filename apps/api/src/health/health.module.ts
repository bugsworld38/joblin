import { Module } from '@nestjs/common';
import { TerminusModule } from '@nestjs/terminus';

import { HealthController } from './health.controller';
import { DatabaseIndicator } from './indicators/database.indicator';

@Module({
  imports: [TerminusModule],
  controllers: [HealthController],
  providers: [DatabaseIndicator],
})
export class HealthModule {}
