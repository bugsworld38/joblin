import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { PaginationDto } from '@common/dtos';
import { calculatePagination } from '@common/utils/pagination.utils';

import { ApplicationsRepository } from './applications.repository';
import { UpdateApplicationRequestDto } from './dtos';

@Injectable()
export class ApplicationsService {
  constructor(private applicationsRepo: ApplicationsRepository) {}

  async create(vacancyId: string, userId: string) {
    const existingApplication = await this.applicationsRepo.findOne({
      vacancyId,
      userId,
    });

    if (existingApplication) {
      throw new ConflictException('You are already tracking this vacancy');
    }

    return this.applicationsRepo.create({
      vacancyId,
      userId,
    });
  }

  async listWithVacancies(userId: string, paginationDto: PaginationDto) {
    const paginationParams = calculatePagination(
      paginationDto.page,
      paginationDto.pageSize,
    );

    return this.applicationsRepo.listWithVacancies(userId, paginationParams);
  }

  async update(id: string, updateApplicationDto: UpdateApplicationRequestDto) {
    const application = await this.applicationsRepo.update(
      { id },
      updateApplicationDto,
    );

    if (!application) {
      throw new NotFoundException('Application not found');
    }

    return application;
  }

  async delete(id: string, userId: string) {
    const application = await this.applicationsRepo.findOne({ id });

    if (!application) {
      throw new NotFoundException('Application not found');
    }

    if (application.userId !== userId) {
      throw new ForbiddenException('You do not own this application');
    }

    return this.applicationsRepo.delete({
      id: application.id,
    });
  }
}
