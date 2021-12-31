import { Log, LogSync } from '@google-cloud/logging';
import { Test } from '@nestjs/testing';
import {
  GOOGLE_LOGGING,
  SLACK_MODULE_OPTIONS,
  SLACK_WEBHOOK_URL,
  SLACK_WEB_CLIENT,
} from '../constants';
import { SlackService } from '../slack.service';
import { createApp } from './fixtures';

describe('google logging', () => {
  let service: SlackService;
  let write: any;

  beforeEach(async () => {
    write = jest.fn();
    const app = await Test.createTestingModule({
      providers: [
        {
          provide: SLACK_MODULE_OPTIONS,
          useValue: { type: 'google' },
        },
        {
          provide: SLACK_WEB_CLIENT,
          useValue: null,
        },
        {
          provide: SLACK_WEBHOOK_URL,
          useValue: null,
        },
        {
          provide: GOOGLE_LOGGING,
          useValue: {
            write,
            entry: (metadata: any, message: any) => ({
              ...metadata,
              message,
            }),
          },
        },
        SlackService,
      ],
    }).compile();
    service = app.get<SlackService>(SlackService);
  });

  it('must output requests as structured logs', async () => {
    const request = {
      text: 'hello-world',
      channel: 'hello-world',
    };
    await service.postMessage(request);
    expect(write).toHaveBeenCalledWith({
      'logging.googleapis.com/labels': { type: 'nestjs-slack' },
      'logging.googleapis.com/operation': {
        producer: 'github.com/bjerkio/nestjs-slack@v1',
      },
      message: { slack: { channel: 'hello-world', text: 'hello-world' } },
      severity: 'NOTICE',
    });
  });

  it('must resolve @google/cloud-logging', async () => {
    const app = await createApp({ type: 'google' });
    expect(app.get(GOOGLE_LOGGING)).toBeInstanceOf(LogSync);
  });
});
