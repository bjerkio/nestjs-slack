import { DynamicModule, Module, Provider } from '@nestjs/common';
import {
  GOOGLE_LOGGING,
  SLACK_MODULE_OPTIONS,
  SLACK_MODULE_USER_OPTIONS,
  SLACK_WEBHOOK_URL,
  SLACK_WEB_CLIENT,
} from './constants';
import { SlackService } from './slack.service';
import {
  SlackAsyncConfig,
  SlackConfig,
  SlackConfigFactory,
  SlackSyncConfig,
} from './types';
import { invariant } from './utils';

@Module({
  providers: [SlackService],
  exports: [SlackService],
})
export class SlackModule {
  static forRoot(opts: Partial<SlackSyncConfig> = {}): DynamicModule {
    const providers = [
      {
        provide: SLACK_MODULE_USER_OPTIONS,
        useValue: opts,
      },
      this.createAsyncConfig(),
      this.createAsyncGoogleLogger(),
      this.createAsyncWebClient(),
      this.createAsyncWebhook(),
    ];
    return {
      global: opts.isGlobal,
      module: SlackModule,
      providers,
      exports: providers,
    };
  }

  static forRootAsync(opts: SlackAsyncConfig): DynamicModule {
    const providers = [
      this.createAsyncOptionsProvider(opts),
      this.createAsyncConfig(),
      this.createAsyncGoogleLogger(),
      this.createAsyncWebClient(),
      this.createAsyncWebhook(),
    ];
    return {
      global: opts.isGlobal,
      module: SlackModule,
      imports: opts.imports,
      providers,
      exports: providers,
    };
  }

  private static createAsyncOptionsProvider(opts: SlackAsyncConfig): Provider {
    if (opts.useFactory) {
      return {
        provide: SLACK_MODULE_USER_OPTIONS,
        useFactory: opts.useFactory,
        inject: opts.inject || [],
      };
    }
    invariant(opts.useClass);
    return {
      provide: SLACK_MODULE_USER_OPTIONS,
      useFactory: async (
        optionsFactory: SlackConfigFactory,
      ): Promise<SlackConfig> => optionsFactory.slackConfigModuleOptions(),
      inject: [opts.useClass],
    };
  }

  private static createAsyncConfig(): Provider {
    return {
      provide: SLACK_MODULE_OPTIONS,
      inject: [SLACK_MODULE_USER_OPTIONS],
      useFactory: async (opts: SlackConfig) => {
        return {
          type: 'stdout',
          output: /* istanbul ignore next */ (out: unknown) =>
            process.stdout.write(`${JSON.stringify(out)}\n`),
          ...opts,
        };
      },
    };
  }

  private static createAsyncGoogleLogger(): Provider {
    return {
      provide: GOOGLE_LOGGING,
      inject: [SLACK_MODULE_OPTIONS],
      useFactory: async (opts: SlackConfig) => {
        if (opts.type !== 'google') {
          return {
            provide: GOOGLE_LOGGING,
            useValue: null,
          };
        }

        const { Logging } = await import('@google-cloud/logging');
        const logging = new Logging();
        return logging.logSync('slack');
      },
    };
  }

  private static createAsyncWebClient(): Provider {
    return {
      provide: SLACK_WEB_CLIENT,
      inject: [SLACK_MODULE_OPTIONS],
      useFactory: async (opts: SlackConfig) => {
        if (opts.type !== 'api') {
          return {
            provide: SLACK_WEB_CLIENT,
            useValue: null,
          };
        }

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

  private static createAsyncWebhook(): Provider {
    return {
      provide: SLACK_WEBHOOK_URL,
      inject: [SLACK_MODULE_OPTIONS],
      useFactory: async (opts: SlackConfig) => {
        if (opts.type !== 'webhook') {
          return {
            provide: SLACK_WEBHOOK_URL,
            useValue: null,
          };
        }

        invariant(
          opts.webhookOptions,
          'You must provide `webhookOptions` when using the webhook type.',
        );

        return opts.webhookOptions.url;
      },
    };
  }
}
