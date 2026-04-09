import { Test, TestingModule } from '@nestjs/testing';

import { ScraperService } from '@scraper/services/scraper.service';

import { VacancyRepository } from '../vacancy.repository';
import { VacancyService } from '../vacancy.service';

describe('VacancyService', () => {
  let service: VacancyService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        VacancyService,
        { provide: VacancyRepository, useValue: {} },
        { provide: ScraperService, useValue: {} },
      ],
    }).compile();

    service = module.get<VacancyService>(VacancyService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
