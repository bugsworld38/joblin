import { Module } from '@nestjs/common';

import { ScraperModule } from '@scraper';

import { VacancyController } from './vacancy.controller';
import { VacancyRepository } from './vacancy.repository';
import { VacancyService } from './vacancy.service';

@Module({
  imports: [ScraperModule],
  controllers: [VacancyController],
  providers: [VacancyService, VacancyRepository],
  exports: [VacancyService, VacancyRepository],
})
export class VacancyModule {}
