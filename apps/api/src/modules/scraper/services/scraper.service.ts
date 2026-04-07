import { BadRequestException, Inject, Injectable } from '@nestjs/common';

import { ScraperStrategy } from '../interfaces';
import { SCRAPER_STRATEGIES_TOKEN } from '../scraper.constants';

@Injectable()
export class ScraperService {
  constructor(
    @Inject(SCRAPER_STRATEGIES_TOKEN) private strategies: ScraperStrategy[],
  ) {}

  async parse(url: string) {
    const strategy = this.strategies.find((strategy) =>
      strategy.canScrape(url),
    );

    if (!strategy) {
      throw new BadRequestException('No supported strategy found for this URL');
    }

    return strategy.scrape(url);
  }
}
