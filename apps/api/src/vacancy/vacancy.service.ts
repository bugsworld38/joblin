import { Injectable } from '@nestjs/common';

import { ScraperService } from '@scraper/services/scraper.service';

import { CreateVacancyRequestDto } from './dtos';
import { VacancyRepository } from './vacancy.repository';

@Injectable()
export class VacancyService {
  constructor(
    private vacancyRepo: VacancyRepository,
    private scraperService: ScraperService,
  ) {}

  async create(createVacancyDto: CreateVacancyRequestDto) {
    const existingVacancy = await this.vacancyRepo.findByUrl(createVacancyDto.url);

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

  async findAll() {
    return this.vacancyRepo.findAll();
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
