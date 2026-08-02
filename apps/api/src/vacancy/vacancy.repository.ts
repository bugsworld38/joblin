import { Injectable } from '@nestjs/common';

import { Pool } from 'pg';

import { PaginatedData, PaginationParams } from '@common/interfaces';

import type { CreateVacancyData, Vacancy } from './interfaces';
import {
  countVacancies,
  countVacancyQueue,
  createVacancy,
  deleteVacancy,
  findVacancies,
  findVacancyByUrl,
  findVacancyQueue,
} from './queries/vacancies.queries';

@Injectable()
export class VacancyRepository {
  constructor(private readonly pool: Pool) {}

  async findByUrl(url: string): Promise<Vacancy | undefined> {
    const [vacancy] = await findVacancyByUrl.run({ url }, this.pool);
    return vacancy as Vacancy | undefined;
  }

  async findMany(
    keyword: string | undefined,
    params: PaginationParams,
  ): Promise<PaginatedData<Vacancy>> {
    const [{ count }] = await countVacancies.run(
      { keyword: keyword ?? null },
      this.pool,
    );

    const data = await findVacancies.run(
      { keyword: keyword ?? null, limit: params.limit, offset: params.offset },
      this.pool,
    );

    return { data: data as Vacancy[], totalCount: Number(count) };
  }

  async findQueue(
    keyword: string,
    userId: string,
    params: PaginationParams,
  ): Promise<PaginatedData<Vacancy>> {
    const [{ count }] = await countVacancyQueue.run(
      { keyword, userId },
      this.pool,
    );

    const data = await findVacancyQueue.run(
      { keyword, userId, limit: params.limit, offset: params.offset },
      this.pool,
    );

    return { data: data as Vacancy[], totalCount: Number(count) };
  }

  async create(data: CreateVacancyData): Promise<Vacancy> {
    const [vacancy] = await createVacancy.run(data, this.pool);
    return vacancy as Vacancy;
  }

  async delete(id: string): Promise<void> {
    await deleteVacancy.run({ id }, this.pool);
  }
}
