import { Global, Inject, Module, OnModuleDestroy } from '@nestjs/common';

import knex, { Knex } from 'knex';
import knexStringcase from 'knex-stringcase';

import { DatabaseConfig, databaseConfig } from '@core/config';

export const KNEX_CONNECTION = 'KNEX_CONNECTION';

@Global()
@Module({
  providers: [
    {
      provide: KNEX_CONNECTION,
      inject: [databaseConfig.KEY],
      useFactory: (config: DatabaseConfig) =>
        knex({
          client: 'pg',
          connection: {
            host: config.host,
            port: config.port,
            user: config.user,
            password: config.password,
            database: config.database,
          },
          pool: {
            min: 2,
            max: 10,
          },
          ...knexStringcase(),
        }),
    },
  ],
  exports: [KNEX_CONNECTION],
})
export class DatabaseModule implements OnModuleDestroy {
  constructor(@Inject(KNEX_CONNECTION) private db: Knex) {}

  async onModuleDestroy() {
    await this.db.destroy();
  }
}
