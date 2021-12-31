import { ModuleMetadata, Type } from '@nestjs/common';
import { WebClientOptions } from '@slack/web-api';

export interface SlackApiOptions {
  /**
   * You'll need a token to authenticate with Slack Web API
   * Read more: https://api.slack.com/tutorials/tracks/getting-a-token
   */
  token: string;

  clientOptions?: WebClientOptions;
}

export interface SlackWebhookOptions {
  /**
   * Incoming Webhooks are a simple way to post messages from apps into Slack.
   * Creating an Incoming Webhook gives you a unique URL to which you send a
   * JSON payload with the message text and some options.
   *
   * Read more: https://api.slack.com/messaging/webhooks
   */
  url: string;
}

export type SlackRequestType = 'api' | 'webhook' | 'stdout' | 'google';

export interface SlackConfig {
  /**
   * This argument refers to how you want to send requests
   * to Slack.
   *
   * `api` is the default option, it utilizes `@slack/web-api`, which also
   * requires setting `apiOptions`. Setting `stdout` and `google` makes
   * this module send requests directly to stdout as a JSON-string. This is
   * useful where you're consuming logs and want to forward them to Slack.
   * `google` provides a JSON structure as Google Logging wants.
   *
   * **Note**: We suggest using a distributed model where logs are consumed
   * when logging to Slack in production; it's easier to dump something to
   * to a logger than calling the Slack Web API.
   *
   * @default stdout
   */
  type: SlackRequestType;

  /**
   * This option is used when channel isn't defined
   * when sending a request.
   */
  defaultChannel?: string;

  /**
   * These configuration options are only required when type is set to
   * `api`.
   */
  apiOptions?: SlackApiOptions;

  /**
   * These configuration options are only required when type is set to
   * `api`.
   */
  webhookOptions?: SlackWebhookOptions;

  /**
   * Setting this changes which function is used to stdout.
   *
   * Only used for types `stdout`
   */
  output?: (out: unknown) => void;
}

export interface SlackSyncConfig extends SlackConfig {
  // If true, registers `SlackModule` as a global module.
  isGlobal?: boolean;
}

export interface SlackAsyncConfig extends Pick<ModuleMetadata, 'imports'> {
  useClass?: Type<SlackConfigFactory>;
  useFactory?: (...args: any[]) => Promise<SlackConfig> | SlackConfig;
  inject?: any[];
  useExisting?: Type<SlackConfigFactory>;

  // If true, registers `SlackModule` as a global module.
  isGlobal?: boolean;
}

export interface SlackConfigFactory {
  slackConfigModuleOptions(): Promise<SlackConfig> | SlackConfig;
}
