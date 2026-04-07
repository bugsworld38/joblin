import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

import { plainToInstance } from 'class-transformer';

import { PaginatedResponseDto, PaginationDto } from '@common/dtos';
import { CurrentUser } from '@core/auth/decorators/current-user.decorator';
import { JwtAuthGuard } from '@core/auth/guards/jwt-auth.guard';
import type { User } from '@modules/users/interfaces';
import { CreateVacancyRequestDto } from '@modules/vacancies/dtos';
import { VacanciesService } from '@modules/vacancies/vacancies.service';

import { ApplicationsService } from './applications.service';
import {
  ApplicationListItemResponseDto,
  ApplicationResponseDto,
  UpdateApplicationRequestDto,
} from './dtos';

@ApiTags('applications')
@ApiBearerAuth('jwt')
@UseGuards(JwtAuthGuard)
@Controller('applications')
export class ApplicationsController {
  constructor(
    private applicationsService: ApplicationsService,
    private vacanciesService: VacanciesService,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Create a new job application' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Application created successfully',
    type: ApplicationListItemResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid input data',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized',
  })
  async create(
    @Body() createVacancyDto: CreateVacancyRequestDto,
    @CurrentUser() currentUser: User,
  ) {
    const vacancy = await this.vacanciesService.create(createVacancyDto);
    const application = await this.applicationsService.create(
      vacancy.id,
      currentUser.id,
    );

    return new ApplicationListItemResponseDto({
      ...application,
      positionTitle: vacancy.positionTitle,
      companyName: vacancy.companyName,
      url: vacancy.url,
    });
  }

  @Get()
  @ApiOperation({
    summary: 'Get paginated list of applications with vacancy details',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'List of applications',
    type: PaginatedResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized',
  })
  async listWithVacancies(
    @Query() paginationDto: PaginationDto,
    @CurrentUser() currentUser: User,
  ) {
    const { data, totalCount } =
      await this.applicationsService.listWithVacancies(
        currentUser.id,
        paginationDto,
      );

    return new PaginatedResponseDto(
      plainToInstance(ApplicationListItemResponseDto, data),
      totalCount,
    );
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update an application' })
  @ApiParam({ name: 'id', description: 'Application ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Application updated successfully',
    type: ApplicationResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Application not found',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized',
  })
  async update(
    @Param('id') id: string,
    @Body() updateApplicationDto: UpdateApplicationRequestDto,
  ) {
    const application = await this.applicationsService.update(
      id,
      updateApplicationDto,
    );

    return new ApplicationResponseDto(application);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete an application' })
  @ApiParam({ name: 'id', description: 'Application ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Application deleted successfully',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Application not found',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized',
  })
  async delete(@Param('id') id: string, @CurrentUser() currentUser: User) {
    return this.applicationsService.delete(id, currentUser.id);
  }
}
