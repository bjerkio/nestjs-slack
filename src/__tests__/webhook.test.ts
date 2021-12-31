import { SlackService } from '../slack.service';
import { createApp } from './fixtures';
import * as nock from 'nock';

describe('webhook', () => {
  let service: SlackService;
  let output: any;

  const baseUrl = 'https://example.com';

  beforeEach(async () => {
    output = jest.fn();
    const app = await createApp({
      type: 'webhook',
      webhookOptions: { url: `${baseUrl}/webhook` },
    });
    service = app.get<SlackService>(SlackService);
  });

  it('must send requests to API', async () => {
    // nock.recorder.rec();
    const scope = nock(baseUrl, { encodedQueryParams: true })
      .post('/webhook', {
        text: 'hello-world',
      })
      .reply(200, 'ok');

    await service.postMessage({ text: 'hello-world' });

    scope.done();
  });

  it('Should throw when request fails', () => {
    const scope = nock(baseUrl, { encodedQueryParams: true })
      .post('/webhook', {
        text: 'hello-world',
      })
      .reply(500, 'fail');

    return service
      .postMessage({ text: 'hello-world' })
      .catch(error =>
        expect(error).toMatchInlineSnapshot(
          `[Error: Could not send request to Slack Webhook: fail]`,
        ),
      );

    // scope.done();
  });
});
