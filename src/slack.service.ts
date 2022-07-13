import type { LogSync } from '@google-cloud/logging';
import { Inject, Injectable } from '@nestjs/common';
import type { ChatPostMessageArguments, WebClient } from '@slack/web-api';
import axios, { AxiosError } from 'axios';
import type { SlackBlockDto } from 'slack-block-builder';
import invariant from 'ts-invariant';
import {
  GOOGLE_LOGGING,
  SLACK_MODULE_OPTIONS,
  SLACK_WEBHOOK_URL,
  SLACK_WEB_CLIENT,
} from './constants';
import type { SlackConfig } from './types';

export type SlackMessageOptions = Partial<ChatPostMessageArguments>;

@Injectable()
export class SlackService {
  constructor(
    @Inject(SLACK_MODULE_OPTIONS) private readonly options: SlackConfig,
    @Inject(SLACK_WEB_CLIENT) private readonly client: WebClient | null,
    @Inject(GOOGLE_LOGGING) private readonly log: LogSync | null,
    @Inject(SLACK_WEBHOOK_URL) private readonly webhookUrl: string | null,
  ) {}

  /**
   * @example
   * ```typescript
   * import { SlackService } from 'nestjs-slack';
   *
   * export class WorldWideController {
   *  constructor(private readonly slack: SlackService){}
   *
   *  sendText(message: string) {
   *    this.slack.sendText(message);
   *  }
   * }
   * ```
   *
   * @param text simple text to send to Slack
   * @param opts SlackMessageOptions
   */
  sendText(
    text: string,
    opts?: Omit<SlackMessageOptions, 'text' | 'blocks'>,
  ): Promise<void> {
    return this.postMessage({ text, ...opts });
  }

  /**
   * Send Blocks (provided by Slack Block Builder)
   *
   * Makes it maintainable to send messages. To use this,
   * please make sure you've installed `slack-block-builder`.
   *
   * ```shell
   * yarn add slack-block-builder@^2
   * ```
   *
   * Read more: https://github.com/raycharius/slack-block-builder
   *
   * @example
   * ```typescript
   * import { SlackService } from 'nestjs-slack';
   * import { BlockCollection, Blocks } from 'slack-block-builder';
   *
   * export class WorldWideController {
   *  constructor(private readonly slack: SlackService){}
   *
   *  sendMessage(message: string) {
   *    this.slack.sendBlocks(
   *      BlockCollection(
   *        Blocks.Section({ text: message }),
   *      ),
   *    );
   *  }
   * }
   * ```
   * @param blocks
   * @param opts
   */
  sendBlocks(
    blocks: Readonly<SlackBlockDto>[],
    opts?: Omit<SlackMessageOptions, 'blocks'>,
  ): Promise<void> {
    return this.postMessage({
      blocks,
      ...opts,
    });
  }

  /**
   * @example
   * ```typescript
   * import { SlackService } from 'nestjs-slack';
   *
   * export class WorldWideController {
   *  constructor(private readonly slack: SlackService){}
   *
   *  sendMessage(message: string) {
   *    this.slack.postMessage({ text: message });
   *  }
   * }
   * ```
   * @param blocks
   * @param opts
   */
  async postMessage(req: SlackMessageOptions): Promise<void> {
    const requestTypes = {
      api: async () => this.runApiRequest(req),
      webhook: async () => this.runWebhookRequest(req),
      stdout: async () => this.runStdoutRequest(req),
      google: async () => this.runGoogleLoggingRequest(req),
    };

    invariant(requestTypes[this.options.type], 'expected option to exist');

    await requestTypes[this.options.type]();
  }

  private async runApiRequest(req: SlackMessageOptions) {
    invariant(this.options.type === 'api');
    invariant(this.client, 'expected this.client to be WebClient');

    const channel = req.channel ?? this.options.defaultChannel;
    invariant(channel, 'neither channel nor defaultChannel was applied');

    await this.client.chat.postMessage({
      channel,
      ...req,
    });
  }

  private async runWebhookRequest(req: SlackMessageOptions) {
    invariant(this.options.type === 'webhook');
    invariant(this.webhookUrl, 'expected webhook url to exist');

    await axios.post(this.webhookUrl, req).catch((error: AxiosError) => {
      invariant(error.response);

      throw new Error(
        `Could not send request to Slack Webhook: ${error.response.data}`,
      );
    });
  }

  private async runStdoutRequest(req: SlackMessageOptions) {
    invariant(this.options.type === 'stdout');
    this.options.output(req);
  }

  private async runGoogleLoggingRequest(req: SlackMessageOptions) {
    invariant(this.options.type === 'google');
    const metadata = {
      severity: 'NOTICE',
      'logging.googleapis.com/labels': { type: 'nestjs-slack' },
      'logging.googleapis.com/operation': {
        producer: 'github.com/bjerkio/nestjs-slack@v1',
      },
    };

    invariant(this.log, 'expected Google Logger instance');

    const channel = req.channel ?? this.options.defaultChannel;

    await this.log.write(
      this.log.entry(metadata, {
        slack: {
          channel,
          ...req,
        },
      }),
    );
  }
}
