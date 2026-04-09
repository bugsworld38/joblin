import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { PaginationDto } from '@common/dtos';
import { calculatePagination } from '@common/utils';

import { ApplicationRepository } from './application.repository';
import { ApplicationStatus } from './interfaces';

@Injectable()
export class ApplicationService {
  constructor(private applicationRepo: ApplicationRepository) {}

  async create(vacancyId: string, userId: string) {
    const existingApplication = await this.applicationRepo.findByUserAndVacancy(
      userId,
      vacancyId,
    );

    if (existingApplication) {
      throw new ConflictException('You are already tracking this vacancy');
    }

    return this.applicationRepo.create({ userId, vacancyId });
  }

  async listWithVacancies(userId: string, paginationDto: PaginationDto) {
    const paginationParams = calculatePagination(
      paginationDto.page,
      paginationDto.pageSize,
    );

    return this.applicationRepo.listWithVacancies(userId, paginationParams);
  }

  async updateStatus(id: string, status: ApplicationStatus) {
    const application = await this.applicationRepo.updateStatus(id, status);

    if (!application) {
      throw new NotFoundException('Application not found');
    }

    return application;
  }

  async updateNotes(id: string, notes: string | null) {
    const application = await this.applicationRepo.updateNotes(id, notes);

    if (!application) {
      throw new NotFoundException('Application not found');
    }

    return application;
  }

  async delete(id: string, userId: string) {
    const application = await this.applicationRepo.findById(id);

    if (!application) {
      throw new NotFoundException('Application not found');
    }

    if (application.userId !== userId) {
      throw new ForbiddenException('You do not own this application');
    }

    return this.applicationRepo.delete(application.id);
  }
}
