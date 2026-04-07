import { Inject, Injectable } from '@nestjs/common';

import { Knex } from 'knex';

import { PaginatedResult, PaginationParams } from '@common/interfaces';
import { KNEX_CONNECTION } from '@core/database/database.module';
import { BaseRepository } from '@core/database/database.repository';

import { Application, ApplicationWithVacancy } from './interfaces';

@Injectable()
export class ApplicationsRepository extends BaseRepository<Application> {
  constructor(@Inject(KNEX_CONNECTION) db: Knex) {
    super(db, 'applications');
  }

  async listWithVacancies(
    userId: string,
    params: PaginationParams,
    trx?: Knex.Transaction,
  ): Promise<PaginatedResult<ApplicationWithVacancy>> {
    const query = this.getQueryBuilder(trx)
      .join('vacancies', 'applications.vacancy_id', 'vacancies.id')
      .where('applications.user_id', userId);

    const [{ count }] = await query.clone().count('applications.id AS count');

    const data = await query
      .select<
        ApplicationWithVacancy[]
      >('applications.id', 'applications.status', 'applications.notes', 'vacancies.position_title', 'vacancies.company_name', 'vacancies.url', 'applications.created_at', 'applications.updated_at')
      .limit(params.limit)
      .offset(params.offset)
      .orderBy('applications.created_at', 'desc');

    return { data, totalCount: Number(count) };
  }
}
