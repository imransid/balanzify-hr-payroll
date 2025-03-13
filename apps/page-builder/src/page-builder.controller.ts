import { Controller, Get } from '@nestjs/common';

@Controller()
export class PageBuilderController {
  constructor() {}

  @Get()
  getHello(): string {
    return 'WELCOME :)';
  }
}
