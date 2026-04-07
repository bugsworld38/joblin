import { Inject, Injectable } from '@nestjs/common';

import { Knex } from 'knex';

import { KNEX_CONNECTION } from '@core/database/database.module';
import { BaseRepository } from '@core/database/database.repository';

import type { User } from './interfaces';

@Injectable()
export class UsersRepository extends BaseRepository<User> {
  constructor(@Inject(KNEX_CONNECTION) db: Knex) {
    super(db, 'users');
  }
}
