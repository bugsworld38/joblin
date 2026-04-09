import { Test, TestingModule } from '@nestjs/testing';

import { VacancyController } from '../vacancy.controller';
import { VacancyService } from '../vacancy.service';

describe('VacancyController', () => {
  let controller: VacancyController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [VacancyController],
      providers: [{ provide: VacancyService, useValue: {} }],
    }).compile();

    controller = module.get<VacancyController>(VacancyController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
