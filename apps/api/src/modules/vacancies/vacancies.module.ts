import { Module } from '@nestjs/common';

import { ScraperModule } from '@modules/scraper/scraper.module';

import { VacanciesController } from './vacancies.controller';
import { VacanciesRepository } from './vacancies.repository';
import { VacanciesService } from './vacancies.service';

@Module({
  imports: [ScraperModule],
  controllers: [VacanciesController],
  providers: [VacanciesService, VacanciesRepository],
  exports: [VacanciesService, VacanciesRepository],
})
export class VacanciesModule {}
