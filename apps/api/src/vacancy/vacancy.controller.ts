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

import { CurrentUser } from '@auth/decorators/current-user.decorator';
import { JwtAuthGuard } from '@auth/guards/jwt-auth.guard';
import type { User } from '@user/interfaces';
import { plainToInstance } from 'class-transformer';

import { PaginatedResponseDto } from '@common/dtos';

import {
  CreateVacancyRequestDto,
  VacancyPreviewResponseDto,
  VacancyQueryRequestDto,
  VacancyQueueRequestDto,
  VacancyResponseDto,
} from './dtos';
import { VacancyService } from './vacancy.service';

@ApiTags('vacancies')
@Controller('vacancies')
export class VacancyController {
  constructor(private vacancyService: VacancyService) {}

  @Post()
  @ApiBearerAuth('jwt')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Create a new vacancy' })
  @ApiResponse({ status: HttpStatus.CREATED, type: VacancyResponseDto })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid input data',
  })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized' })
  async create(@Body() createVacancyDto: CreateVacancyRequestDto) {
    const vacancy = await this.vacancyService.create(createVacancyDto);
    return new VacancyResponseDto(vacancy);
  }

  @Get()
  @ApiOperation({
    summary: 'Get paginated vacancies, optionally filtered by keyword',
  })
  @ApiQuery({
    name: 'keyword',
    required: false,
    description: 'Keyword to filter by',
  })
  @ApiQuery({ name: 'page', required: false, description: 'Page number' })
  @ApiQuery({ name: 'pageSize', required: false, description: 'Page size' })
  @ApiResponse({ status: HttpStatus.OK, type: PaginatedResponseDto })
  async findMany(@Query() query: VacancyQueryRequestDto) {
    const { data, totalCount } = await this.vacancyService.findMany(query);

    return new PaginatedResponseDto(
      plainToInstance(VacancyResponseDto, data),
      totalCount,
    );
  }

  @Get('queue')
  @ApiBearerAuth('jwt')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary:
      'Get paginated queue of active, unapplied vacancies matching a keyword',
  })
  @ApiQuery({
    name: 'keyword',
    required: true,
    description: 'Keyword to filter by',
  })
  @ApiQuery({ name: 'page', required: false, description: 'Page number' })
  @ApiQuery({ name: 'pageSize', required: false, description: 'Page size' })
  @ApiResponse({ status: HttpStatus.OK, type: PaginatedResponseDto })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized' })
  async findQueue(
    @Query() query: VacancyQueueRequestDto,
    @CurrentUser() currentUser: User,
  ) {
    const { data, totalCount } = await this.vacancyService.findQueue(
      query,
      currentUser.id,
    );

    return new PaginatedResponseDto(
      plainToInstance(VacancyResponseDto, data),
      totalCount,
    );
  }

  @Delete(':id')
  @ApiBearerAuth('jwt')
  @UseGuards(JwtAuthGuard)
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
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized' })
  async delete(@Param('id') id: string) {
    return this.vacancyService.delete(id);
  }

  @Get('preview')
  @ApiBearerAuth('jwt')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Preview vacancy details from URL' })
  @ApiQuery({ name: 'url', description: 'Job listing URL to scrape' })
  @ApiResponse({ status: HttpStatus.OK, type: VacancyPreviewResponseDto })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Invalid URL' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized' })
  async preview(@Query('url') url: string) {
    const vacancyPreview = await this.vacancyService.lookupSource(url);
    return new VacancyPreviewResponseDto(vacancyPreview);
  }
}
