import { Inject, Injectable } from '@nestjs/common';
import {
  HealthIndicatorResult,
  HealthIndicatorService,
} from '@nestjs/terminus';

import { Knex } from 'knex';

import { KNEX_CONNECTION } from '@core/database/database.module';

@Injectable()
export class DatabaseIndicator {
  constructor(
    @Inject(KNEX_CONNECTION) private db: Knex,
    private healthIndicatorService: HealthIndicatorService,
  ) {}

  async isHealthy(key: string): Promise<HealthIndicatorResult> {
    const indicator = this.healthIndicatorService.check(key);

    try {
      await this.db.raw('SELECT 1');

      return indicator.up();
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';

      return indicator.down({ message });
    }
  }
}
