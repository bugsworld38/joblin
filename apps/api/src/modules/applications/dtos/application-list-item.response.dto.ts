import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

import { Expose } from 'class-transformer';

import { ApplicationStatus, ApplicationWithVacancy } from '../interfaces';

export class ApplicationListItemResponseDto {
  @ApiProperty({
    description: 'Application ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @Expose()
  id: string;

  @ApiProperty({
    description: 'Application status',
    enum: ApplicationStatus,
    example: ApplicationStatus.SentCv,
  })
  @Expose()
  status: ApplicationStatus;

  @ApiPropertyOptional({
    description: 'User notes about the application',
    example: 'Had a great interview',
    nullable: true,
  })
  @Expose()
  notes: string | null;

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

  constructor(partial: Partial<ApplicationWithVacancy>) {
    Object.assign(this, partial);
  }
}
