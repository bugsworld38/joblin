import { Test, TestingModule } from '@nestjs/testing';

import { VacancyService } from '@vacancy';

import { ApplicationController } from '../application.controller';
import { ApplicationService } from '../application.service';

describe('ApplicationController', () => {
  let controller: ApplicationController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ApplicationController],
      providers: [
        { provide: ApplicationService, useValue: {} },
        { provide: VacancyService, useValue: {} },
      ],
    }).compile();

    controller = module.get<ApplicationController>(ApplicationController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
