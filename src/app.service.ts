import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHealthy(): string {
    return 'Tweeter AI is running!';
  }
}
