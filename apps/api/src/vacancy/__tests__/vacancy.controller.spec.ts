import { Test, TestingModule } from '@nestjs/testing';

import type { User } from '@user/interfaces';

import { VacancyQueueRequestDto } from '../dtos';
import { VacancyController } from '../vacancy.controller';
import { VacancyService } from '../vacancy.service';

describe('VacancyController', () => {
  let controller: VacancyController;
  let vacancyService: { findQueue: jest.Mock };

  beforeEach(async () => {
    vacancyService = { findQueue: jest.fn() };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [VacancyController],
      providers: [{ provide: VacancyService, useValue: vacancyService }],
    }).compile();

    controller = module.get<VacancyController>(VacancyController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findQueue', () => {
    it('passes the current user id through to the service and wraps the result in a PaginatedResponseDto', async () => {
      const query: VacancyQueueRequestDto = {
        keyword: 'engineer',
        page: 1,
        pageSize: 10,
      };
      const currentUser = { id: 'user-1' } as User;
      const vacancy = {
        id: 'v1',
        positionTitle: 'Engineer',
        companyName: 'Acme',
        url: 'https://example.com/jobs/1',
        status: 'active',
        lastSeenAt: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      vacancyService.findQueue.mockResolvedValue({
        data: [vacancy],
        totalCount: 1,
      });

      const result = await controller.findQueue(query, currentUser);

      expect(vacancyService.findQueue).toHaveBeenCalledWith(
        query,
        currentUser.id,
      );
      expect(result.totalCount).toBe(1);
      expect(result.data).toHaveLength(1);
      expect(result.data[0].id).toBe(vacancy.id);
    });
  });
});
