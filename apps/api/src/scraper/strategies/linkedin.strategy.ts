import { Inject, Injectable } from '@nestjs/common';

import type { AxiosInstance } from 'axios';

import { SCRAPER_AXIOS_INSTANCE_TOKEN } from '../scraper.constants';
import { BaseScraperStrategy } from './base-scraper.strategy';

@Injectable()
export class LinkedinStrategy extends BaseScraperStrategy {
  readonly name = 'linkedin';
  protected readonly hostname = 'linkedin.com';
  protected readonly selectors = {
    positionTitle: ['h3.base-search-card__title'],
    companyName: ['a.hidden-nested-link[href*="/company/"]'],
  };

  constructor(@Inject(SCRAPER_AXIOS_INSTANCE_TOKEN) axios: AxiosInstance) {
    super(axios);
  }
}
