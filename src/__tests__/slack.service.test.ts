import { WebClient } from '@slack/web-api';
import { BlockCollection, Blocks } from 'slack-block-builder';
import { createApp } from './fixtures';
import { SlackService } from '../slack.service';

describe('SlackService', () => {
  it('must be defined', async () => {
    const app = await createApp();
    expect(app.get<SlackService>(SlackService)).toBeDefined();
  });

  describe('helpers', () => {
    let service: SlackService;
    beforeEach(async () => {
      const app = await createApp();
      service = app.get<SlackService>(SlackService);
      service.postMessage = jest.fn();
      service.postEphemeral = jest.fn();
    });
    describe('sendText', () => {
      it('must forward to sendMessage', async () => {
        await service.sendText('hello world');
        expect(service.postMessage).toHaveBeenCalledWith({
          text: 'hello world',
        });
      });
    });
    describe('postEphemeral', () => {
      it('must forward to postEphemeralMessage', async () => {
        await service.sendText('hello world');
        expect(service.postEphemeral).toHaveBeenCalledWith({
          text: 'hello world',
          user: 'some-user-id',
          channel: 'some-channel',
        });
      });
    });

    describe('sendBlocks', () => {
      it('must forward to sendMessage', async () => {
        const blocks = BlockCollection(Blocks.Section({ text: 'hello-world' }));
        await service.sendBlocks(blocks);
        expect(service.postMessage).toHaveBeenCalledWith({ blocks });
      });
    });

    describe('WebClient', () => {
      it('slack sdk WebClient is available', async () => {
        expect(service.client).toBeDefined();
      });
    });
  });
});
