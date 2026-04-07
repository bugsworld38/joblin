import { ApiProperty } from '@nestjs/swagger';

import {
  IsNotEmpty,
  IsString,
  IsUrl,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateVacancyRequestDto {
  @ApiProperty({
    description: 'Job position title',
    example: 'Senior Software Engineer',
    minLength: 3,
    maxLength: 100,
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(100)
  positionTitle: string;

  @ApiProperty({
    description: 'Company name',
    example: 'Acme Corp',
  })
  @IsString()
  @IsNotEmpty()
  companyName: string;

  @ApiProperty({
    description: 'Job listing URL',
    example: 'https://example.com/jobs/123',
  })
  @IsUrl()
  @IsNotEmpty()
  url: string;
}
