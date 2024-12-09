import { Module } from '@nestjs/common';
import { WeeklysService } from './weeklys.service';
import { WeeklysController } from './weeklys.controller';

@Module({
  controllers: [WeeklysController],
  providers: [WeeklysService],
})
export class WeeklysModule {}
