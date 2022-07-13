import { MockedWebClient } from '@slack-wrench/jest-mock-web-client';
import { SlackService } from '../slack.service';
import { createApp } from './fixtures';

describe('api', () => {
  let service: SlackService;
  let output: any;

  beforeEach(async () => {
    output = jest.fn();
    const app = await createApp({
      type: 'api',
      defaultChannel: 'my-channel',
      token: 'my-token',
    });
    service = app.get<SlackService>(SlackService);
  });

  it('must send requests to API', async () => {
    await service.postMessage({ text: 'hello-world' });
    expect(
      MockedWebClient.mock.instances[0].chat.postMessage,
    ).toHaveBeenCalledWith({
      channel: 'my-channel',
      text: 'hello-world',
    });
  });
});
