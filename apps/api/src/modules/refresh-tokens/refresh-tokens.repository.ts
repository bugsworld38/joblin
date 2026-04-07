import { Inject, Injectable } from '@nestjs/common';

import { Knex } from 'knex';

import { KNEX_CONNECTION } from '@core/database/database.module';
import { BaseRepository } from '@core/database/database.repository';

import { RefreshToken } from './interfaces';

@Injectable()
export class RefreshTokensRepository extends BaseRepository<RefreshToken> {
  constructor(@Inject(KNEX_CONNECTION) db: Knex) {
    super(db, 'refresh_tokens');
  }
}
