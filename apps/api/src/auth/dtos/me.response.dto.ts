import { ApiProperty } from '@nestjs/swagger';

import { User } from '@user/interfaces';
import { Expose } from 'class-transformer';

export class MeResponseDto {
  @ApiProperty({
    description: 'User ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @Expose()
  id: string;

  @ApiProperty({
    description: 'User email address',
    example: 'user@example.com',
  })
  @Expose()
  email: string;

  constructor(partial: Partial<User>) {
    Object.assign(this, partial);
  }
}
