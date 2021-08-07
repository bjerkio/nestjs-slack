import { Test } from '@nestjs/testing';
import { SlackConfig, SlackModule } from '../slack.module';
import { SlackService } from '../slack.service';
import { MockedWebClient } from '@slack-wrench/jest-mock-web-client';
import { BlockCollection, Blocks } from 'slack-block-builder';

describe('SlackService', () => {
  let service: SlackService;
  let output: any;

  const createApp = (options?: Partial<SlackConfig>) => {
    return Test.createTestingModule({
      imports: [SlackModule.forRoot(options)],
    }).compile();
  };

  it('should be defined', async () => {
    const app = await createApp();
    expect(app.get<SlackService>(SlackService)).toBeDefined();
  });

  describe('helpers', () => {
    let service: SlackService;
    beforeEach(async () => {
      const app = await createApp();
      service = app.get<SlackService>(SlackService);
      service.postMessage = jest.fn();
    });
    describe('sendText', () => {
      it('should forward to sendMessage', async () => {
        await service.sendText('hello world');
        expect(service.postMessage).toHaveBeenCalledWith({
          text: 'hello world',
        });
      });
    });

    describe('sendBlocks', () => {
      it('should forward to sendMessage', async () => {
        const blocks = BlockCollection(Blocks.Section({ text: 'hello-world' }));
        await service.sendBlocks(blocks);
        expect(service.postMessage).toHaveBeenCalledWith({ blocks });
      });
    });
  });

  describe('types', () => {
    describe('api', () => {
      beforeEach(async () => {
        output = jest.fn();
        const app = await createApp({
          type: 'api',
          defaultChannel: 'my-channel',
          apiOptions: { token: 'my-token' },
        });
        service = app.get<SlackService>(SlackService);
      });

      it('should send requests to API', async () => {
        await service.postMessage({ text: 'hello-world' });
        expect(
          MockedWebClient.mock.instances[0].chat.postMessage,
        ).toHaveBeenCalledWith({
          channel: 'my-channel',
          text: 'hello-world',
        });
      });
    });

    describe('stdout', () => {
      beforeEach(async () => {
        output = jest.fn();
        const app = await createApp({ output });
        service = app.get<SlackService>(SlackService);
      });

      it('should output requests to stdout', async () => {
        const request = {
          text: 'hello-world',
          channel: 'hello-world',
        };
        await service.postMessage(request);
        expect(output).toHaveBeenCalledWith(request);
      });
    });

    describe('stackdriver', () => {
      beforeEach(async () => {
        output = jest.fn();
        const app = await createApp({ type: 'stackdriver', output });
        service = app.get<SlackService>(SlackService);
      });

      it('should output requests to stdout with structured logs', async () => {
        const request = {
          text: 'hello-world',
          channel: 'hello-world',
        };
        await service.postMessage(request);
        expect(output).toHaveBeenCalledWith({
          message: request,
          severity: 'NOTICE',
          'logging.googleapis.com/labels': { type: 'nestjs-slack' },
          'logging.googleapis.com/operation': {
            producer: 'github.com/bjerkio/nestjs-slack',
          },
        });
      });
    });
  });
});
