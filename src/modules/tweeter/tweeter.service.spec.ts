import { Test, TestingModule } from '@nestjs/testing';
import { TweeterService } from './tweeter.service';

describe('TweeterService', () => {
  let service: TweeterService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TweeterService],
    }).compile();

    service = module.get<TweeterService>(TweeterService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
