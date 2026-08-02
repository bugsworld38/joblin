import { ApiPropertyOptional } from '@nestjs/swagger';

import { IsOptional, IsString } from 'class-validator';

import { PaginationRequestDto } from '@common/dtos';

export class VacancyQueryRequestDto extends PaginationRequestDto {
  @ApiPropertyOptional({
    description: 'Keyword to search in position title and company name',
    example: 'engineer',
  })
  @IsOptional()
  @IsString()
  keyword?: string;
}
