import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

import { plainToInstance } from 'class-transformer';

import { JwtAuthGuard } from '@core/auth/guards/jwt-auth.guard';

import {
  CreateVacancyRequestDto,
  VacancyPreviewResponseDto,
  VacancyResponseDto,
} from './dtos';
import { VacanciesService } from './vacancies.service';

@ApiTags('vacancies')
@ApiBearerAuth('jwt')
@UseGuards(JwtAuthGuard)
@Controller('vacancies')
export class VacanciesController {
  constructor(private vacanciesService: VacanciesService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new vacancy' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Vacancy created successfully',
    type: VacancyResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid input data',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized',
  })
  async create(@Body() createVacancyDto: CreateVacancyRequestDto) {
    const vacancy = await this.vacanciesService.create(createVacancyDto);

    return new VacancyResponseDto(vacancy);
  }

  @Get()
  @ApiOperation({ summary: 'Get all vacancies' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'List of vacancies',
    type: [VacancyResponseDto],
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized',
  })
  async findAll() {
    const vacancies = await this.vacanciesService.findAll();

    return plainToInstance(VacancyResponseDto, vacancies);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a vacancy' })
  @ApiParam({ name: 'id', description: 'Vacancy ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Vacancy deleted successfully',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Vacancy not found',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized',
  })
  async delete(@Param('id') id: string) {
    return this.vacanciesService.delete(id);
  }

  @Get('preview')
  @ApiOperation({ summary: 'Preview vacancy details from URL' })
  @ApiQuery({ name: 'url', description: 'Job listing URL to scrape' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Vacancy preview data',
    type: VacancyPreviewResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid URL',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized',
  })
  async preview(@Query('url') url: string) {
    const vacancyPreview = await this.vacanciesService.lookupSource(url);

    return new VacancyPreviewResponseDto(vacancyPreview);
  }
}
