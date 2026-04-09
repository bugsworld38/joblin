import { ApiProperty } from '@nestjs/swagger';

import { Expose } from 'class-transformer';

import { Vacancy } from '../interfaces';

export class VacancyResponseDto {
  @ApiProperty({
    description: 'Vacancy ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @Expose()
  id: string;

  @ApiProperty({
    description: 'Job position title',
    example: 'Senior Software Engineer',
  })
  @Expose()
  positionTitle: string;

  @ApiProperty({
    description: 'Company name',
    example: 'Acme Corp',
  })
  @Expose()
  companyName: string;

  @ApiProperty({
    description: 'Job listing URL',
    example: 'https://example.com/jobs/123',
  })
  @Expose()
  url: string;

  @ApiProperty({
    description: 'Creation timestamp',
    example: '2024-01-01T00:00:00.000Z',
  })
  @Expose()
  createdAt: Date;

  @ApiProperty({
    description: 'Last update timestamp',
    example: '2024-01-01T00:00:00.000Z',
  })
  @Expose()
  updatedAt: Date;

  constructor(partial: Partial<Vacancy>) {
    Object.assign(this, partial);
  }
}
