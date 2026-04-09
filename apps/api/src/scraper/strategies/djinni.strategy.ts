import { Inject, Injectable } from '@nestjs/common';

import type { AxiosInstance } from 'axios';

import { SCRAPER_AXIOS_INSTANCE_TOKEN } from '../scraper.constants';
import { BaseScraperStrategy } from './base-scraper.strategy';

@Injectable()
export class DjinniStrategy extends BaseScraperStrategy {
  readonly name = 'djinni';
  protected readonly hostname = 'djinni.co';

  protected readonly selectors = {
    positionTitle: ['h1 > span'],
    companyName: ['a.text-reset[href*="/jobs/company-"]'],
  };

  constructor(@Inject(SCRAPER_AXIOS_INSTANCE_TOKEN) axios: AxiosInstance) {
    super(axios);
  }
}
