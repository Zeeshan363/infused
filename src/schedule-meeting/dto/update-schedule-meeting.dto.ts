import { PartialType } from '@nestjs/mapped-types';
import { CreateScheduleMeetingDto } from './create-schedule-meeting.dto';

export class UpdateScheduleMeetingDto extends PartialType(CreateScheduleMeetingDto) {}
