# Data Flow
User → Chat UI → Webhook (Make) → Scenario → Response → UI update.

Front-end state handled by Zustand:
```
useStore: {
  user, messages[], currentModule,
  addMessage(), setUser(), setModule()
}
```

API connectors:
- /modules/api.js → centralizes fetch to Make, Gmail, Outlook.
- /modules/storage.js → local/session persistence.

Hook examples:
- useWebhook() → manages async send/receive.
- useAnalytics() → tracks message volume, latency.
