import { Test } from '@nestjs/testing';
import { SlackModule } from '../slack.module';
import { SlackConfig } from '../types';

export const createApp = (options?: Partial<SlackConfig>) => {
  return Test.createTestingModule({
    imports: [SlackModule.forRoot(options)],
  }).compile();
};
