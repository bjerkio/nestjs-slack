import { Test } from '@nestjs/testing';
import { SlackModule } from '../slack.module';
import { SlackService } from '../slack.service';
import * as nock from 'nock';
import { Injectable, Module } from '@nestjs/common';
import { SlackConfig } from '../types';
import { MockAgent, setGlobalDispatcher } from 'undici';

describe('slack.module', () => {
  const baseUrl = 'http://example.com';

  const mockAgent = new MockAgent();
  setGlobalDispatcher(mockAgent);
  const mockPool = mockAgent.get(baseUrl);

  it('should construct with useFactory', async () => {
    const app = await Test.createTestingModule({
      imports: [
        SlackModule.forRootAsync({
          useFactory: () => {
            return {
              type: 'webhook',
              url: `${baseUrl}/webhook`,
            };
          },
        }),
      ],
    }).compile();
    const service = app.get<SlackService>(SlackService);

    mockPool
      .intercept({
        path: '/webhook',
        method: 'POST',
        body: JSON.stringify({ text: 'hello-world' }),
      })
      .reply(200, 'ok');

    await service.postMessage({ text: 'hello-world' });
  });

  it('should construct with useClass', async () => {
    @Injectable()
    class ConfigClass {
      slackConfigModuleOptions(): SlackConfig {
        return {
          type: 'webhook',
          url: `${baseUrl}/webhook`,
        };
      }
    }

    @Module({
      exports: [ConfigClass],
      providers: [ConfigClass],
    })
    class TestModule {}

    const app = await Test.createTestingModule({
      imports: [
        SlackModule.forRootAsync({
          imports: [TestModule],
          useClass: ConfigClass,
        }),
      ],
    }).compile();
    const service = app.get<SlackService>(SlackService);

    mockPool
      .intercept({
        path: '/webhook',
        method: 'POST',
        body: JSON.stringify({ text: 'hello-world' }),
      })
      .reply(200, 'ok');

    await service.postMessage({ text: 'hello-world' });
  });
});
