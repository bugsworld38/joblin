import { ApiPropertyOptional } from '@nestjs/swagger';

import { IsOptional, IsString } from 'class-validator';

export class UpdateApplicationNotesRequestDto {
  @ApiPropertyOptional({ example: 'Scheduled interview for next week' })
  @IsOptional()
  @IsString()
  notes: string | null;
}
