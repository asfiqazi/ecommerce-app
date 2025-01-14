import * as Sentry from "@sentry/react";
import { BrowserTracing } from "@sentry/tracing";

Sentry.init({
  dsn: import.meta.env.VITE_SENTRY_DSN,
  integrations: [new BrowserTracing()],
  
  // Performance monitoring
  tracesSampleRate: import.meta.env.PROD ? 0.1 : 1.0,
  
  // Error tracking
  attachStacktrace: true,
  
  // Ignore specific errors
  ignoreErrors: [
    'Network Error',
    'Failed to fetch',
    'AbortError',
    'ResizeObserver loop limit exceeded'
  ],
  
  // Filtering sensitive data
  beforeSend(event) {
    // Remove personal identifiable information
    if (event.user) {
      delete event.user.email;
    }
    
    return event;
  },
  
  // Performance monitoring configuration
  tracePropagationTargets: [
    'localhost',
    /^https:\/\/your-domain\.com/,
    /^https:\/\/api\.your-domain\.com/
  ]
});
