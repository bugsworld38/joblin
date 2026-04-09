import { Module } from '@nestjs/common';

import { VacancyModule } from '@vacancy';

import { ApplicationController } from './application.controller';
import { ApplicationRepository } from './application.repository';
import { ApplicationService } from './application.service';

@Module({
  imports: [VacancyModule],
  providers: [ApplicationRepository, ApplicationService],
  exports: [ApplicationService],
  controllers: [ApplicationController],
})
export class ApplicationModule {}
