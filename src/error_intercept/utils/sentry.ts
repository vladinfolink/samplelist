// src/utils/sentry.ts
import * as Sentry from "@sentry/react";

interface ErrorContext {
  [key: string]: unknown;
  url?: string;
  timestamp?: number;
  tags?: Record<string, string>;
  metadata?: Record<string, string | number | boolean>;
}

const dsn =
  "https://6ccd5141ec4eb62ae7a21cd6f76f6ea9@o4508269166002176.ingest.de.sentry.io/4508269297467472";

export const initializeSentry = () => {
  if (!import.meta.env.VITE_SENTRY_DSN || !dsn) {
    console.warn("Sentry DSN not found in environment variables or scope");
    return;
  }

  Sentry.init({
    dsn,
    integrations: [
      Sentry.browserTracingIntegration(),
      Sentry.replayIntegration(),
    ],
    tracesSampleRate: 1.0,
    tracePropagationTargets: ["localhost", /^https:\/\/yourserver\.io\/api/],
    replaysSessionSampleRate: 0.1,
    replaysOnErrorSampleRate: 1.0,
    environment: import.meta.env.MODE,
    beforeSend(event) {
      return event;
    },
  });
};

export const captureError = (error: Error, context?: ErrorContext) => {
  Sentry.captureException(error, {
    extra: context,
  });
};

export const useErrorBoundary = Sentry.withErrorBoundary;
