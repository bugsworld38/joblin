import { Inject, Injectable } from '@nestjs/common';

import { Knex } from 'knex';

import { KNEX_CONNECTION } from '@core/database/database.module';
import { BaseRepository } from '@core/database/database.repository';

import { Vacancy } from './interfaces';

@Injectable()
export class VacanciesRepository extends BaseRepository<Vacancy> {
  constructor(@Inject(KNEX_CONNECTION) db: Knex) {
    super(db, 'vacancies');
  }
}
