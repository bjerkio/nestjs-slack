import { SlackService } from '../slack.service';
import { createApp } from './fixtures';

describe('stdout', () => {
  let service: SlackService;
  let output: any;

  beforeEach(async () => {
    output = jest.fn();
    const app = await createApp({ output });
    service = app.get<SlackService>(SlackService);
  });

  it('must output requests to stdout', async () => {
    const request = {
      text: 'hello-world',
      channel: 'hello-world',
    };
    await service.postMessage(request);
    expect(output).toHaveBeenCalledWith(request);
  });
});
