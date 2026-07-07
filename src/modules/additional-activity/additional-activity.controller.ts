import { Controller, Get } from '@nestjs/common';
import { AdditionalActivityDto } from './dto/additional-activity.dto';
import { AdditionalActivityService } from './additional-activity.service';

@Controller()
export class AdditionalActivityController {
  constructor(
    private readonly additionalActivityService: AdditionalActivityService,
  ) {}

  @Get()
  async getAdditionalActivities(): Promise<AdditionalActivityDto[]> {
    return this.additionalActivityService.findAll();
  }
}
