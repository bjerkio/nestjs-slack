# Migrate from v1 to v2

We've simplified configuration, essentially flattened the options.

Before:

```typescript
SlackModule.forRoot({
  type: 'webhook',
  webhookOptions: {
    url: '<the webhook url>',
  },
}),
```

After:

```typescript
SlackModule.forRoot({
  type: 'webhook',
  url: '<the webhook url>',
}),
```

This is also is true for `apiOptions`. The values are still the same.
