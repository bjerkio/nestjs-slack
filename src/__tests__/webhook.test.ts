import { SlackService } from '../slack.service';
import { createApp } from './fixtures';
import * as nock from 'nock';

describe('webhook', () => {
  let service: SlackService;

  const baseUrl = 'https://example.com';

  describe('simple webhook', () => {
    it('must send requests to API', async () => {
      const app = await createApp({
        type: 'webhook',
        url: `${baseUrl}/simple-webhook`,
      });
      service = app.get<SlackService>(SlackService);

      const scope = nock(baseUrl, { encodedQueryParams: true })
        .post('/simple-webhook', {
          text: 'hello-world',
        })
        .reply(200, 'ok');

      await service.postMessage({ text: 'hello-world' });

      scope.done();
    });

    it.skip('Should throw when request fails', async () => {
      expect.assertions(1);
      const scope = nock(baseUrl, { encodedQueryParams: true })
        .post('/failing-simple-webhook', {
          text: 'hello-world',
        })
        .reply(500, 'fail');
      const app = await createApp({
        type: 'webhook',
        url: `${baseUrl}/failing-simple-webhook`,
      });
      service = app.get<SlackService>(SlackService);

      await service
        .postMessage({ text: 'hello-world' })
        .catch(error => expect(error).toMatchInlineSnapshot());

      scope.done();
    });
  });

  describe('multiple webhooks', () => {
    beforeEach(async () => {
      const app = await createApp({
        type: 'webhook',
        channels: [
          {
            name: 'test-channel',
            url: `${baseUrl}/test-webhook`,
          },
          {
            name: 'failing-test-channel',
            url: `${baseUrl}/failing-webhook`,
          },
        ],
      });
      service = app.get<SlackService>(SlackService);
    });

    it('must send requests to API', async () => {
      const scope = nock(baseUrl, { encodedQueryParams: true })
        .post('/test-webhook', {
          text: 'hello-world',
        })
        .reply(200, 'ok');

      await service.postMessage({
        text: 'hello-world',
        channel: 'test-channel',
      });

      scope.done();
    });

    it('should throw when channel does not exist', () => {
      expect.assertions(1);
      service
        .postMessage({ text: 'hello-world', channel: 'not-a-channel' })
        .catch(e =>
          expect(e).toMatchInlineSnapshot(
            `[Error: The channel not-a-channel does not exist. You must add this in the channels option.]`,
          ),
        );
    });
  });
});
