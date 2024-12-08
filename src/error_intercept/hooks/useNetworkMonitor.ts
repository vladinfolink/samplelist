import { useState, useEffect, useRef, useCallback } from "react";
import { NetworkCall, NetworkStats } from "../types/monitoring";

type XHROpenMethod = typeof XMLHttpRequest.prototype.open;

export const useNetworkMonitor = () => {
  const [stats, setStats] = useState<NetworkStats>({
    calls: {},
    errors: [],
  });

  const originalFetch = useRef<typeof window.fetch>();
  const originalXHR = useRef<XHROpenMethod>();

  const recordNetworkCall = useCallback((call: NetworkCall) => {
    setStats((prev) => ({
      calls: {
        ...prev.calls,
        [call.url]: [...(prev.calls[call.url] || []), call],
      },
      errors: call.error ? [...prev.errors, call] : prev.errors,
    }));
  }, []);

  const setupFetchInterceptor = useCallback(() => {
    originalFetch.current = window.fetch;
    window.fetch = async (input: RequestInfo | URL, init?: RequestInit) => {
      const url =
        typeof input === "string"
          ? input
          : input instanceof URL
          ? input.href
          : input.url;
      const timestamp = Date.now();

      try {
        const response = await originalFetch.current!(input, init);
        recordNetworkCall({ url, timestamp, status: response.status });
        return response;
      } catch (error) {
        const networkError =
          error instanceof Error ? error : new Error("Network request failed");
        recordNetworkCall({ url, timestamp, error: networkError });
        throw error;
      }
    };
  }, [recordNetworkCall]);

  const setupXHRInterceptor = useCallback(() => {
    originalXHR.current = XMLHttpRequest.prototype.open;
    XMLHttpRequest.prototype.open = function (
      this: XMLHttpRequest,
      method: string,
      url: string | URL,
      async?: boolean,
      username?: string | null,
      password?: string | null
    ) {
      const timestamp = Date.now();

      this.addEventListener("load", () => {
        recordNetworkCall({
          url: url.toString(),
          timestamp,
          status: this.status,
        });
      });

      this.addEventListener("error", () => {
        recordNetworkCall({
          url: url.toString(),
          timestamp,
          error: new Error("XHR request failed"),
        });
      });

      if (originalXHR.current) {
        return originalXHR.current.call(
          this,
          method,
          url,
          async ?? true,
          username ?? null,
          password ?? null
        );
      }
      throw new Error("XHR interceptor not properly initialized");
    };
  }, [recordNetworkCall]);

  useEffect(() => {
    setupFetchInterceptor();
    setupXHRInterceptor();

    return () => {
      if (originalFetch.current) window.fetch = originalFetch.current;
      if (originalXHR.current)
        XMLHttpRequest.prototype.open = originalXHR.current;
    };
  }, [setupFetchInterceptor, setupXHRInterceptor]);

  return stats;
};
