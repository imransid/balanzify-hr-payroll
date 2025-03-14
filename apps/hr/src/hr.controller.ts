import { Controller, Get } from '@nestjs/common';

@Controller()
export class HrController {
  constructor() {}

  @Get()
  getHello(): string {
    return 'WELCOME :)';
  }
}
