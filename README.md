<p align="center">
    <img src="./.github/logo.svg" alt="Logo" width="150px">
</p>

<p align="center">
    <h3 align="center">nestjs-slack</h3>
</p>

<p align="center">
    Lightweight library to use Slack in NestJS applications.
    <br />
    <br />
    <a href="#space_invader--usage">Quick Start Guide</a>
    ·
    <a href="https://github.com/bjerkio/nestjs-slack/issues">Request Feature</a>
    ·
    <a href="https://github.com/bjerkio/nestjs-slack/issues">Report Bug</a>
  </p>
</p>

---

[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square)](https://github.com/prettier/prettier)
[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg?style=flat-square)](http://commitizen.github.io/cz-cli/)
![Release](https://github.com/bjerkio/nestjs-slack/workflows/Release/badge.svg)

[![Language grade: JavaScript](https://img.shields.io/lgtm/grade/javascript/g/bjerkio/nestjs-slack.svg?logo=lgtm&logoWidth=18)](https://lgtm.com/projects/g/bjerkio/nestjs-slack/context:javascript)
[![codecov](https://codecov.io/gh/bjerkio/nestjs-slack/branch/main/graph/badge.svg)](https://codecov.io/gh/bjerkio/nestjs-slack)
[![Maintainability](https://api.codeclimate.com/v1/badges/95329385d5f02494fd7a/maintainability)](https://codeclimate.com/github/bjerkio/nestjs-slack/maintainability)

**NestjS Slack** helps you sending Slack messages in your [NestJS] application.
Combined with `slack-block-builder` you can easily create maintainable, testable
and reusable Slack code declaratively and ready for production.

[nestjs]: https://github.com/nestjs/nest

### :zap: &nbsp; Features

- Used in many production workloads.
- Building blocks with [slack-block-builder].
- Supports sending messages directly to Slack Web API.
- Supports Google Stackdriver (Logger).
- Zero dependencies (there are `peerDependencies`)

[slack-block-builder]: https://github.com/raycharius/slack-block-builder

### :space_invader: &nbsp; Usage

```shell
▶ yarn add nestjs-slack
```

```typescript
import { Module } from '@nestjs/common';
import { SlackModule } from 'nestjs-slack';

@Module({
  imports: [
    SlackModule.forRoot({
      type: 'api',
      apiOptions: {
        token: '<insert-token-here',
      },
    }),
  ],
})
export class AppModule {}
```

### Example

You can easily inject `SlackService` to be used in your services, controllers,
etc.

```typescript
import { Injectable } from '@nestjs/common';
import { SlackService } from 'nestjs-slack';

@Injectable()
export class AuthService {
  constructor(private service: SlackService) {}

  helloWorldMethod() {
    this.service.sendText('Hello world was sent!');
    return 'hello world';
  }
}
```

### Use with Google Logging

```shell
▶ yarn add @google-cloud/logging
```

```typescript
import { SlackModule } from 'nestjs-slack';

@Module({
  imports: [SlackModule.forRoot({ type: 'google' })],
})
export class AppModule {}
```

When `type` is set to `google` the `@google-cloud/logging` package will be used
to send logs to stdout [according to structured logs][structured-logs].

You can deploy [gcl-slack] to consume logs from this library.

[structured-logs]: https://cloud.google.com/logging/docs/structured-logging
[gcl-slack]: https://github.com/bjerkio/gcl-slack

## Contribute & Disclaimer

We love to get help 🙏 Read more about how to get started in
[CONTRIBUTING](CONTRIBUTING.md) 🌳
