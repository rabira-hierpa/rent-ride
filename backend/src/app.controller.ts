import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { WinstonLoggerService } from './logger/service/logger.service';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly logger: WinstonLoggerService,
  ) {}

  @Get()
  getHello(): string {
    this.logger.debug('Hello world');
    return this.appService.getHello();
  }
}
