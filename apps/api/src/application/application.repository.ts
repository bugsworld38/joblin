import { Injectable } from '@nestjs/common';

import { Pool } from 'pg';

import { PaginatedData, PaginationParams } from '@common/interfaces';

import {
  Application,
  ApplicationStatus,
  ApplicationWithVacancy,
  CreateApplicationData,
} from './interfaces';
import {
  countApplicationsByUser,
  createApplication,
  deleteApplication,
  findApplicationById,
  findApplicationByUserAndVacancy,
  listApplicationsWithVacancies,
  updateApplicationNotes,
  updateApplicationStatus,
} from './queries/applications.queries';

@Injectable()
export class ApplicationRepository {
  constructor(private readonly pool: Pool) {}

  async findById(id: string): Promise<Application | undefined> {
    const [application] = await findApplicationById.run({ id }, this.pool);

    return application as Application;
  }

  async findByUserAndVacancy(
    userId: string,
    vacancyId: string,
  ): Promise<Application | undefined> {
    const [application] = await findApplicationByUserAndVacancy.run(
      { userId, vacancyId },
      this.pool,
    );

    return application as Application;
  }

  async create(data: CreateApplicationData): Promise<Application> {
    const [application] = await createApplication.run(data, this.pool);

    return application as Application;
  }

  async updateStatus(
    id: string,
    status: ApplicationStatus,
  ): Promise<Application | undefined> {
    const [application] = await updateApplicationStatus.run(
      { id, status },
      this.pool,
    );

    return application as Application;
  }

  async updateNotes(
    id: string,
    notes: string | null,
  ): Promise<Application | undefined> {
    const [application] = await updateApplicationNotes.run(
      { id, notes },
      this.pool,
    );

    return application as Application;
  }

  async delete(id: string): Promise<void> {
    await deleteApplication.run({ id }, this.pool);
  }

  async listWithVacancies(
    userId: string,
    params: PaginationParams,
  ): Promise<PaginatedData<ApplicationWithVacancy>> {
    const [{ count }] = await countApplicationsByUser.run(
      { userId },
      this.pool,
    );

    const data = await listApplicationsWithVacancies.run(
      { userId, limit: params.limit, offset: params.offset },
      this.pool,
    );

    return {
      data: data as ApplicationWithVacancy[],
      totalCount: Number(count),
    };
  }
}
