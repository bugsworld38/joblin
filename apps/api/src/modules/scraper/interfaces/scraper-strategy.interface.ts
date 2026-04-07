import { VacancyPreview } from '@modules/vacancies/interfaces';

export interface ScraperStrategy {
  name: string;
  canScrape(url: string): boolean;
  scrape(url: string): Promise<VacancyPreview>;
}
