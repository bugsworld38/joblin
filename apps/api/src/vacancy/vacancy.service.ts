import { Injectable } from '@nestjs/common';

import { ScraperService } from '@scraper';

import { calculateOffset } from '@common/utils';

import {
  CreateVacancyRequestDto,
  VacancyQueryRequestDto,
  VacancyQueueRequestDto,
} from './dtos';
import { VacancyRepository } from './vacancy.repository';

@Injectable()
export class VacancyService {
  constructor(
    private vacancyRepo: VacancyRepository,
    private scraperService: ScraperService,
  ) {}

  async create(createVacancyDto: CreateVacancyRequestDto) {
    const existingVacancy = await this.vacancyRepo.findByUrl(
      createVacancyDto.url,
    );

    if (existingVacancy) {
      return existingVacancy;
    }

    return this.vacancyRepo.create(createVacancyDto);
  }

  async delete(id: string) {
    return this.vacancyRepo.delete(id);
  }

  async findByUrl(url: string) {
    return this.vacancyRepo.findByUrl(url);
  }

  async findMany(dto: VacancyQueryRequestDto) {
    const offset = calculateOffset(dto.page, dto.pageSize);

    return this.vacancyRepo.findMany(dto.keyword, {
      limit: dto.pageSize,
      offset,
    });
  }

  async findQueue(dto: VacancyQueueRequestDto, userId: string) {
    const offset = calculateOffset(dto.page, dto.pageSize);

    return this.vacancyRepo.findQueue(dto.keyword, userId, {
      limit: dto.pageSize,
      offset,
    });
  }

  async lookupSource(url: string) {
    const vacancy = await this.findByUrl(url);

    if (!vacancy) {
      return this.scraperService.parse(url);
    }

    return {
      positionTitle: vacancy.positionTitle,
      companyName: vacancy.companyName,
      url,
    };
  }
}
