import { Global, Inject, Module, OnApplicationShutdown } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';

import { Pool } from 'pg';

import { databaseConfig } from '@config';

@Global()
@Module({
  providers: [
    {
      provide: Pool,
      inject: [databaseConfig.KEY],
      useFactory: (config: ConfigType<typeof databaseConfig>) =>
        new Pool({
          host: config.host,
          port: config.port,
          user: config.user,
          password: config.password,
          database: config.database,
        }),
    },
  ],
  exports: [Pool],
})
export class DatabaseModule implements OnApplicationShutdown {
  constructor(@Inject(Pool) private readonly pool: Pool) {}

  async onApplicationShutdown() {
    await this.pool.end();
  }
}
