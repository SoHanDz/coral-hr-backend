import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAccessGuard } from '../auth/guards/jwt-access.guard.js';
import { TimeOffsService } from './time-offs.service.js';
import { CreateTimeOffDto } from './dto/create-time-off.dto.js';
import { UpdateTimeOffDto } from './dto/update-time-off.dto.js';

// Controller expose các endpoint REST cho Đơn xin nghỉ phép - yêu cầu đã đăng nhập
@ApiTags('TimeOffs')
@ApiBearerAuth('access-token')
@UseGuards(JwtAccessGuard)
@Controller('time-offs')
export class TimeOffsController {
  constructor(private readonly timeOffsService: TimeOffsService) {}

  @Post()
  create(@Body() dto: CreateTimeOffDto) {
    return this.timeOffsService.create(dto);
  }

  @Get()
  findAll() {
    return this.timeOffsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.timeOffsService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateTimeOffDto) {
    return this.timeOffsService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.timeOffsService.remove(id);
  }
}
