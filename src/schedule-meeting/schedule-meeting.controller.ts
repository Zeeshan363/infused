import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ScheduleMeetingService } from './schedule-meeting.service';
import { CreateScheduleMeetingDto } from './dto/create-schedule-meeting.dto';

@Controller('schedule-meeting')
export class ScheduleMeetingController {
  constructor(private readonly scheduleMeetingService: ScheduleMeetingService) {}

  @Post()
  create(@Body() createScheduleMeetingDto: CreateScheduleMeetingDto) {
    return this.scheduleMeetingService.create(createScheduleMeetingDto);
  }

  @Post('getAccessToken')
  getAccessToken(@Body() code: string) {
    return this.scheduleMeetingService.getAccessToken({code});
  }


}
