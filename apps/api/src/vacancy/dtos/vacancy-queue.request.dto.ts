import { ApiProperty } from '@nestjs/swagger';

import { IsNotEmpty, IsString } from 'class-validator';

import { PaginationRequestDto } from '@common/dtos';

export class VacancyQueueRequestDto extends PaginationRequestDto {
  @ApiProperty({
    description: 'Keyword to filter active, unapplied vacancies',
    example: 'engineer',
  })
  @IsString()
  @IsNotEmpty()
  keyword: string;
}
