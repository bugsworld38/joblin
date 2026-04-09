import { Inject, Injectable } from '@nestjs/common';

import { SCRAPER_AXIOS_INSTANCE_TOKEN } from '@scraper/scraper.constants';
import type { AxiosInstance } from 'axios';

import { BaseScraperStrategy } from './base-scraper.strategy';

@Injectable()
export class DouStrategy extends BaseScraperStrategy {
  readonly name = 'dou';
  protected readonly hostname = 'dou.ua';
  protected readonly selectors = {
    positionTitle: ['h1'],
    companyName: ['.l-n > a:first-child'],
  };

  constructor(@Inject(SCRAPER_AXIOS_INSTANCE_TOKEN) axios: AxiosInstance) {
    super(axios);
  }
}
