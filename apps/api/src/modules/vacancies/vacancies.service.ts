import { Injectable } from '@nestjs/common';

import { ScraperService } from '@modules/scraper/services/scraper.service';

import { CreateVacancyRequestDto } from './dtos';
import { VacanciesRepository } from './vacancies.repository';

@Injectable()
export class VacanciesService {
  constructor(
    private vacanciesRepo: VacanciesRepository,
    private scraperService: ScraperService,
  ) {}

  async create(createVacancyDto: CreateVacancyRequestDto) {
    const existingVacancy = await this.vacanciesRepo.findOne({
      url: createVacancyDto.url,
    });

    if (existingVacancy) {
      return existingVacancy;
    }

    return this.vacanciesRepo.create(createVacancyDto);
  }

  async delete(id: string) {
    return this.vacanciesRepo.delete({ id });
  }

  async lookupSource(url: string) {
    const vacancy = await this.findByUrl(url);

    if (!vacancy) {
      return this.scraperService.parse(url);
    }

    return vacancy;
  }

  async findByUrl(url: string) {
    return this.vacanciesRepo.findOne({ url });
  }

  async findAll() {
    return this.vacanciesRepo.findAll();
  }
}
