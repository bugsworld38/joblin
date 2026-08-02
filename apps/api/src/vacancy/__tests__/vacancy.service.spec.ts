import { Test, TestingModule } from '@nestjs/testing';

import { ScraperService } from '@scraper/scraper.service';

import { VacancyQueueRequestDto } from '../dtos';
import { VacancyRepository } from '../vacancy.repository';
import { VacancyService } from '../vacancy.service';

describe('VacancyService', () => {
  let service: VacancyService;
  let vacancyRepo: { findQueue: jest.Mock };

  beforeEach(async () => {
    vacancyRepo = { findQueue: jest.fn() };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        VacancyService,
        { provide: VacancyRepository, useValue: vacancyRepo },
        { provide: ScraperService, useValue: {} },
      ],
    }).compile();

    service = module.get<VacancyService>(VacancyService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findQueue', () => {
    it('delegates to the repository with the offset computed from page/pageSize and the current user id', async () => {
      const dto: VacancyQueueRequestDto = {
        keyword: 'engineer',
        page: 2,
        pageSize: 10,
      };
      const userId = 'user-1';
      const expectedResult = { data: [], totalCount: 0 };
      vacancyRepo.findQueue.mockResolvedValue(expectedResult);

      const result = await service.findQueue(dto, userId);

      expect(vacancyRepo.findQueue).toHaveBeenCalledWith('engineer', userId, {
        limit: 10,
        offset: 10,
      });
      expect(result).toBe(expectedResult);
    });
  });
});
