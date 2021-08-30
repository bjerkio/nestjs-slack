import { Test } from '@nestjs/testing';
import { SlackConfig, SlackModule } from '../slack.module';

export const createApp = (options?: Partial<SlackConfig>) => {
  return Test.createTestingModule({
    imports: [SlackModule.forRoot(options)],
  }).compile();
};
