import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { AdditionalActivityService } from './additional-activity.service';
import { AdditionalActivityDto } from './dto/additional-activity.dto';
import { CreateAdditionalActivityDto } from './dto/create-additional-activity.dto';
import { DeleteAdditionalActivityDto } from './dto/delete-additional-activity.dto';
import { UpdateAdditionalActivityDto } from './dto/update-additional-activity.dto';

@Controller()
export class AdditionalActivityController {
  constructor(
    private readonly additionalActivityService: AdditionalActivityService,
  ) {}

  @Get()
  async getAdditionalActivities(): Promise<AdditionalActivityDto[]> {
    return this.additionalActivityService.findAll();
  }

  @Get(':id')
  async getAdditionalActivity(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<AdditionalActivityDto> {
    return this.additionalActivityService.findOne(id);
  }

  @Post()
  async createAdditionalActivity(
    @Body() createDto: CreateAdditionalActivityDto,
  ): Promise<AdditionalActivityDto> {
    return this.additionalActivityService.create(createDto);
  }

  @Patch()
  async updateAdditionalActivity(
    @Body() updateDto: UpdateAdditionalActivityDto,
  ): Promise<AdditionalActivityDto> {
    return this.additionalActivityService.update(updateDto);
  }

  @Delete()
  async deleteAdditionalActivity(
    @Body() deleteDto: DeleteAdditionalActivityDto,
  ): Promise<AdditionalActivityDto> {
    return this.additionalActivityService.delete(deleteDto);
  }
}
