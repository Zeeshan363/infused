import { Test, TestingModule } from '@nestjs/testing';
import { ScheduleMeetingService } from './schedule-meeting.service';

describe('ScheduleMeetingService', () => {
  let service: ScheduleMeetingService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ScheduleMeetingService],
    }).compile();

    service = module.get<ScheduleMeetingService>(ScheduleMeetingService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
