import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { PaginationDto } from '@common/dtos';
import { calculateOffset } from '@common/utils';

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
      throw new ConflictException('Already tracking this vacancy');
    }

    return this.applicationRepo.create({ userId, vacancyId });
  }

  async listWithVacancies(userId: string, dto: PaginationDto) {
    const offset = calculateOffset(dto.page, dto.pageSize);

    return this.applicationRepo.listWithVacancies(userId, {
      limit: dto.pageSize,
      offset,
    });
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
      throw new ForbiddenException(
        'Cannot delete an application that belongs to another user',
      );
    }

    return this.applicationRepo.delete(application.id);
  }
}
