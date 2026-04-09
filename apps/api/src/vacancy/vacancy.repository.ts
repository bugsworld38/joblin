import { Injectable } from '@nestjs/common';

import { Pool } from 'pg';

import type { CreateVacancyData, Vacancy } from './interfaces';
import {
  createVacancy,
  deleteVacancy,
  findAllVacancies,
  findVacancyByUrl,
} from './queries/vacancies.queries';

@Injectable()
export class VacancyRepository {
  constructor(private readonly pool: Pool) {}

  async findByUrl(url: string): Promise<Vacancy | undefined> {
    const [vacancy] = await findVacancyByUrl.run({ url }, this.pool);
    return vacancy;
  }

  async findAll(): Promise<Vacancy[]> {
    return findAllVacancies.run(undefined, this.pool);
  }

  async create(data: CreateVacancyData): Promise<Vacancy> {
    const [vacancy] = await createVacancy.run(data, this.pool);
    return vacancy;
  }

  async delete(id: string): Promise<void> {
    await deleteVacancy.run({ id }, this.pool);
  }
}
