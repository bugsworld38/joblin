import { Module } from '@nestjs/common';

import axios, { AxiosInstance } from 'axios';

import {
  SCRAPER_AXIOS_INSTANCE_TOKEN,
  SCRAPER_STRATEGIES_TOKEN,
} from './scraper.constants';
import { ScraperService } from './services/scraper.service';
import { DjinniStrategy } from './strategies/djinni.strategy';

@Module({
  providers: [
    ScraperService,
    DjinniStrategy,
    {
      provide: SCRAPER_STRATEGIES_TOKEN,
      inject: [DjinniStrategy],
      useFactory: (djinni: DjinniStrategy) => [djinni],
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
