import { Controller, Get } from '@nestjs/common';
import { ApiExcludeEndpoint } from '@nestjs/swagger';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('')
  @ApiExcludeEndpoint()
  helloWorld() {
    return `
    <title>서버</title>
    <h2>서버</h2>`;
  }
}
