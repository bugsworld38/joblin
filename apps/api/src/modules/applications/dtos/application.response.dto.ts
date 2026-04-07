import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

import { Expose } from 'class-transformer';

import { Application, ApplicationStatus } from '../interfaces';

export class ApplicationResponseDto {
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

  constructor(partial: Partial<Application>) {
    Object.assign(this, partial);
  }
}
