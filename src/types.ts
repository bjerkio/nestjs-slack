import { ModuleMetadata, Type } from '@nestjs/common';
import { WebClientOptions } from '@slack/web-api';

export interface SlackApiOptions {
  type: 'api';

  /**
   * You'll need a token to authenticate with Slack Web API
   * Read more: https://api.slack.com/tutorials/tracks/getting-a-token
   */
  token: string;

  /**
   * This option is used when channel isn't defined
   * when sending a request.
   */
  defaultChannel?: string;

  clientOptions?: WebClientOptions;
}

export interface SlackWebhookOptions {
  type: 'webhook';

  /**
   * Incoming Webhooks are a simple way to post messages from apps into Slack.
   * Creating an Incoming Webhook gives you a unique URL to which you send a
   * JSON payload with the message text and some options.
   *
   * Read more: https://api.slack.com/messaging/webhooks
   */
  url: string;
}

export interface SlackStdoutOptions {
  type: 'stdout';

  /**
   * Setting this changes which function is used to stdout.
   */
  output?: (out: unknown) => void;
}

export interface SlackGoogleOptions {
  type: 'google';

  /**
   * This option is used when channel isn't defined
   * when sending a request.
   */
  defaultChannel?: string;
}

export type SlackConfig =
  | SlackApiOptions
  | SlackWebhookOptions
  | SlackStdoutOptions
  | SlackGoogleOptions;

export type SlackSyncConfig = SlackConfig & {
  // If true, registers `SlackModule` as a global module.
  isGlobal?: boolean;
};

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
