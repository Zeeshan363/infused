import { Test, TestingModule } from '@nestjs/testing';
import { ScheduleMeetingController } from './schedule-meeting.controller';
import { ScheduleMeetingService } from './schedule-meeting.service';

describe('ScheduleMeetingController', () => {
  let controller: ScheduleMeetingController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ScheduleMeetingController],
      providers: [ScheduleMeetingService],
    }).compile();

    controller = module.get<ScheduleMeetingController>(ScheduleMeetingController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
