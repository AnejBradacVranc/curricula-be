import { Controller, Get } from '@nestjs/common';
import { Category } from 'generated/prisma/client';
import { CategoriesService } from './category.service';

@Controller()
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Get()
  async getCategories(): Promise<Category[]> {
    return this.categoriesService.findAll();
  }
}
