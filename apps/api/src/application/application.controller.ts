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

import { CurrentUser } from '@auth/decorators/current-user.decorator';
import { JwtAuthGuard } from '@auth/guards/jwt-auth.guard';
import type { User } from '@user/interfaces';
import { VacancyService } from '@vacancy';
import { CreateVacancyRequestDto } from '@vacancy/dtos';
import { plainToInstance } from 'class-transformer';

import { PaginatedResponseDto, PaginationDto } from '@common/dtos';

import { ApplicationService } from './application.service';
import {
  ApplicationListItemResponseDto,
  ApplicationResponseDto,
  UpdateApplicationNotesRequestDto,
  UpdateApplicationStatusRequestDto,
} from './dtos';

@ApiTags('applications')
@ApiBearerAuth('jwt')
@UseGuards(JwtAuthGuard)
@Controller('applications')
export class ApplicationController {
  constructor(
    private applicationService: ApplicationService,
    private vacancyService: VacancyService,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Create a new job application' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    type: ApplicationListItemResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid input data',
  })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized' })
  async create(
    @Body() createVacancyDto: CreateVacancyRequestDto,
    @CurrentUser() currentUser: User,
  ) {
    const vacancy = await this.vacancyService.create(createVacancyDto);
    const application = await this.applicationService.create(
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
  @ApiResponse({ status: HttpStatus.OK, type: PaginatedResponseDto })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized' })
  async listWithVacancies(
    @Query() paginationDto: PaginationDto,
    @CurrentUser() currentUser: User,
  ) {
    const { data, totalCount } =
      await this.applicationService.listWithVacancies(
        currentUser.id,
        paginationDto,
      );

    return new PaginatedResponseDto(
      plainToInstance(ApplicationListItemResponseDto, data),
      totalCount,
    );
  }

  @Patch(':id/status')
  @ApiOperation({ summary: 'Update application status' })
  @ApiParam({ name: 'id', description: 'Application ID' })
  @ApiResponse({ status: HttpStatus.OK, type: ApplicationResponseDto })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Application not found',
  })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized' })
  async updateStatus(
    @Param('id') id: string,
    @Body() dto: UpdateApplicationStatusRequestDto,
  ) {
    const application = await this.applicationService.updateStatus(
      id,
      dto.status,
    );

    return new ApplicationResponseDto(application);
  }

  @Patch(':id/notes')
  @ApiOperation({ summary: 'Update application notes' })
  @ApiParam({ name: 'id', description: 'Application ID' })
  @ApiResponse({ status: HttpStatus.OK, type: ApplicationResponseDto })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Application not found',
  })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized' })
  async updateNotes(
    @Param('id') id: string,
    @Body() dto: UpdateApplicationNotesRequestDto,
  ) {
    const application = await this.applicationService.updateNotes(
      id,
      dto.notes,
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
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized' })
  async delete(@Param('id') id: string, @CurrentUser() currentUser: User) {
    return this.applicationService.delete(id, currentUser.id);
  }
}
