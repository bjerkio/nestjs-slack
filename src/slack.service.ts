import { Inject, Injectable } from '@nestjs/common';
import type { ChatPostMessageArguments, WebClient } from '@slack/web-api';
import type { SlackBlockDto } from 'slack-block-builder';
import { SLACK_MODULE_OPTIONS, SLACK_WEB_CLIENT } from './constants';
import type { SlackConfig, SlackRequestType } from './slack.module';
import { StructuredJson } from './types';
import { invariant } from './utils';

export type SlackMessageOptions = Partial<ChatPostMessageArguments>;

@Injectable()
export class SlackService {
  constructor(
    @Inject(SLACK_MODULE_OPTIONS) private readonly options: SlackConfig,
    @Inject(SLACK_WEB_CLIENT) private readonly client: WebClient | null,
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
    if (!req.channel) {
      invariant(
        this.options.defaultChannel,
        'neither channel nor defaultChannel was applied',
      );
      req.channel = this.options.defaultChannel;
    }

    const requestTypes: Record<SlackRequestType, () => Promise<void>> = {
      api: async () => {
        invariant(this.client, 'expected this.client to be WebClient');
        invariant(req.channel, 'expected channel to be applied');

        // We're type-casting since Typescript is confused about `channel`
        // being optional above. We're asserting above, but still it is confused. 🤷‍♂️
        await this.client.chat.postMessage(req as ChatPostMessageArguments);
      },
      stdout: async () => {
        this.options.output(req);
      },
      stackdriver: async () => {
        const entry: StructuredJson = {
          severity: 'NOTICE',
          message: req,
          'logging.googleapis.com/labels': { type: 'nestjs-slack' },
          'logging.googleapis.com/operation': {
            producer: 'github.com/bjerkio/nestjs-slack',
          },
        };

        this.options.output(entry);
      },
    };

    await requestTypes[this.options.type]();
  }
}
