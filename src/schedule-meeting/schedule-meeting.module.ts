import { Module } from '@nestjs/common';
import { ScheduleMeetingService } from './schedule-meeting.service';
import { ScheduleMeetingController } from './schedule-meeting.controller';

@Module({
  controllers: [ScheduleMeetingController],
  providers: [ScheduleMeetingService],
})
export class ScheduleMeetingModule {}
