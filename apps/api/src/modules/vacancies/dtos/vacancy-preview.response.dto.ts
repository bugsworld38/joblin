import { ApiPropertyOptional } from '@nestjs/swagger';

import { Expose } from 'class-transformer';

import { VacancyPreview } from '../interfaces';

export class VacancyPreviewResponseDto {
  @ApiPropertyOptional({
    description: 'Job position title (scraped from URL)',
    example: 'Senior Software Engineer',
  })
  @Expose()
  positionTitle?: string;

  @ApiPropertyOptional({
    description: 'Company name (scraped from URL)',
    example: 'Acme Corp',
  })
  @Expose()
  companyName?: string;

  @ApiPropertyOptional({
    description: 'Normalized job listing URL',
    example: 'https://example.com/jobs/123',
  })
  @Expose()
  url?: string;

  constructor(partial: VacancyPreview) {
    Object.assign(this, partial);
  }
}
