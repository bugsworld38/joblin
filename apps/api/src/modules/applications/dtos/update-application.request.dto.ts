import { ApiPropertyOptional } from '@nestjs/swagger';

import { IsEnum, IsOptional, IsString } from 'class-validator';

import { ApplicationStatus } from '../interfaces';

export class UpdateApplicationRequestDto {
  @ApiPropertyOptional({
    description: 'Application status',
    enum: ApplicationStatus,
    example: ApplicationStatus.Interview,
  })
  @IsOptional()
  @IsEnum(ApplicationStatus)
  status?: ApplicationStatus;

  @ApiPropertyOptional({
    description: 'User notes about the application',
    example: 'Scheduled interview for next week',
  })
  @IsOptional()
  @IsString()
  notes?: string;
}
