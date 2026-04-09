import { ApiProperty } from '@nestjs/swagger';

import { IsEnum } from 'class-validator';

import { ApplicationStatus } from '../interfaces';

export class UpdateApplicationStatusRequestDto {
  @ApiProperty({ enum: ApplicationStatus, example: ApplicationStatus.Interview })
  @IsEnum(ApplicationStatus)
  status: ApplicationStatus;
}
