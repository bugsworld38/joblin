import { BadGatewayException } from '@nestjs/common';

import { AxiosInstance } from 'axios';
import parse, { HTMLElement } from 'node-html-parser';

import { VacancyPreview } from '@modules/vacancies/interfaces';

import { ScraperStrategy } from '../interfaces';

export interface ScraperSelectors {
  positionTitle: string[];
  companyName: string[];
}

export abstract class BaseScraperStrategy implements ScraperStrategy {
  abstract readonly name: string;
  protected abstract readonly hostname: string;
  protected abstract readonly selectors: ScraperSelectors;

  constructor(protected readonly axios: AxiosInstance) {}

  canScrape(url: string) {
    try {
      const parsedUrl = new URL(url);

      return parsedUrl.hostname.includes(this.hostname);
    } catch {
      return false;
    }
  }

  async scrape(url: string): Promise<VacancyPreview> {
    const html = await this.fetchPage(url);
    const root = parse(html);

    const positionTitle = this.extractText(root, this.selectors.positionTitle);
    const companyName = this.extractText(root, this.selectors.companyName);

    if (!positionTitle) {
      throw new BadGatewayException(
        `Could not extract position title from ${url}`,
      );
    }

    return {
      positionTitle,
      companyName,
      url,
    };
  }

  protected async fetchPage(url: string): Promise<string> {
    try {
      const response = await this.axios.get<string>(url);

      return response.data;
    } catch (error) {
      throw new BadGatewayException(
        `Failed to fetch ${url}: ${(error as Error).message}`,
      );
    }
  }

  protected extractText(root: HTMLElement, selectors: string[]): string | null {
    for (const selector of selectors) {
      const element = root.querySelector(selector);
      const text = element?.text.trim();

      if (text) {
        return text;
      }
    }

    return null;
  }
}
