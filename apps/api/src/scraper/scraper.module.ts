import { Module } from '@nestjs/common';

import axios, { AxiosInstance } from 'axios';

import {
  SCRAPER_AXIOS_INSTANCE_TOKEN,
  SCRAPER_STRATEGIES_TOKEN,
} from './scraper.constants';
import { ScraperService } from './scraper.service';
import { DjinniStrategy } from './strategies/djinni.strategy';
import { DouStrategy } from './strategies/dou.strategy';
import { LinkedinStrategy } from './strategies/linkedin.strategy';

@Module({
  providers: [
    ScraperService,
    DjinniStrategy,
    DouStrategy,
    LinkedinStrategy,
    {
      provide: SCRAPER_STRATEGIES_TOKEN,
      inject: [DjinniStrategy, DouStrategy, LinkedinStrategy],
      useFactory: (
        djinni: DjinniStrategy,
        dou: DouStrategy,
        linkedin: LinkedinStrategy,
      ) => [djinni, dou, linkedin],
    },
    {
      provide: SCRAPER_AXIOS_INSTANCE_TOKEN,
      useFactory: (): AxiosInstance => {
        return axios.create({
          headers: {
            'User-Agent':
              'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          },
        });
      },
    },
  ],
  exports: [ScraperService],
})
export class ScraperModule {}
