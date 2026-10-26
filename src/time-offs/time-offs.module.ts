import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TimeOff } from './time-off.entity.js';
import { TimeOffsController } from './time-offs.controller.js';
import { TimeOffsService } from './time-offs.service.js';

@Module({
  imports: [TypeOrmModule.forFeature([TimeOff])],
  controllers: [TimeOffsController],
  providers: [TimeOffsService],
  exports: [TimeOffsService],
})
export class TimeOffsModule {}
