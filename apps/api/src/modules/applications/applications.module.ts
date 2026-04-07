import { Module } from '@nestjs/common';

import { VacanciesModule } from '@modules/vacancies/vacancies.module';

import { ApplicationsController } from './applications.controller';
import { ApplicationsRepository } from './applications.repository';
import { ApplicationsService } from './applications.service';

@Module({
  imports: [VacanciesModule],
  providers: [ApplicationsRepository, ApplicationsService],
  exports: [ApplicationsService],
  controllers: [ApplicationsController],
})
export class ApplicationsModule {}
