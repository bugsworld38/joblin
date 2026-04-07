import { ApiProperty } from '@nestjs/swagger';

import { Expose } from 'class-transformer';

export class PaginatedResponseDto<T> {
  @ApiProperty({
    description: 'Array of items',
    isArray: true,
  })
  @Expose()
  data: T[];

  @ApiProperty({
    description: 'Total number of items',
    example: 100,
  })
  @Expose()
  totalCount: number;

  constructor(data: T[], totalCount: number) {
    this.data = data;
    this.totalCount = totalCount;
  }
}
