import { DynamicModule, Module, Provider } from '@nestjs/common';
import type { WebClientOptions } from '@slack/web-api';
import {
  GOOGLE_LOGGING,
  SLACK_MODULE_OPTIONS,
  SLACK_WEB_CLIENT,
} from './constants';
import { SlackService } from './slack.service';
import { invariant } from './utils';

export interface SlackApiOptions {
  /**
   * You'll need a token to authenticate with Slack Web API
   * Read more: https://api.slack.com/tutorials/tracks/getting-a-token
   */
  token: string;

  clientOptions?: WebClientOptions;
}

export type SlackRequestType = 'api' | 'stdout' | 'google';

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
   * Setting this changes which function is used to stdout.
   *
   * Only used for types `stdout`
   */
  output?: (out: unknown) => void;

  // If true, registers `SlackModule` as a global module.
  isGlobal?: boolean;
}

@Module({
  providers: [SlackService],
  exports: [SlackService],
})
export class SlackModule {
  static forRoot(opts?: Partial<SlackConfig>): DynamicModule {
    const options: SlackConfig = {
      type: 'stdout',
      output: /* istanbul ignore next */ (out: unknown) =>
        process.stdout.write(`${JSON.stringify(out)}\n`),
      ...opts,
    };

    const providers = [
      {
        provide: SLACK_MODULE_OPTIONS,
        useValue: options,
      },
      this.createAsyncGoogleLogger(options),
      this.createAsyncWebClient(options),
    ];
    return {
      global: options.isGlobal,
      module: SlackModule,
      providers,
      exports: providers,
    };
  }

  private static createAsyncGoogleLogger({ type }: SlackConfig): Provider {
    if (type !== 'google') {
      return {
        provide: GOOGLE_LOGGING,
        useValue: null,
      };
    }

    return {
      provide: GOOGLE_LOGGING,
      useFactory: async () => {
        const { Logging } = await import('@google-cloud/logging');
        const logging = new Logging();
        return logging.logSync('slack');
      },
    };
  }

  private static createAsyncWebClient({ type }: SlackConfig): Provider {
    if (type !== 'api') {
      return {
        provide: SLACK_WEB_CLIENT,
        useValue: null,
      };
    }

    return {
      provide: SLACK_WEB_CLIENT,
      inject: [SLACK_MODULE_OPTIONS],
      useFactory: async (opts: SlackConfig) => {
        invariant(
          opts.apiOptions,
          'You must provide `apiOptions` when using the api type.',
        );

        const { WebClient } = await import('@slack/web-api');
        return new WebClient(
          opts.apiOptions.token,
          opts.apiOptions.clientOptions,
        );
      },
    };
  }
}
