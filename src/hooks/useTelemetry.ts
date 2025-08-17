"use client";

type TelemetryEventProps = Record<string, unknown> | undefined;

declare global {
  interface Window {
    plausible?: (event: string, options?: { props?: Record<string, unknown> }) => void;
    gtag?: (...args: unknown[]) => void;
  }
}

export function useTelemetry() {
  function track(event: string, props?: TelemetryEventProps) {
    if (typeof window === "undefined") return;

    try {
      if (typeof window.plausible === "function") {
        window.plausible(event, props ? { props } : undefined);
        return;
      }

      if (typeof window.gtag === "function") {
        window.gtag("event", event, props || {});
        return;
      }

      // Fallback: silent debug for development
      if (process.env.NODE_ENV !== "production") {
        // eslint-disable-next-line no-console
        console.debug(`[telemetry] ${event}`, props || {});
      }
    } catch {
      // Swallow telemetry errors
    }
  }

  return { track };
}
