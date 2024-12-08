// src/__tests__/monitoring.test.tsx
import { render, screen, waitFor } from "@testing-library/react";
import { act } from "react";
import { vi, describe, it, expect, beforeEach, afterEach } from "vitest";
// import { SentryErrorBoundary } from "../error_intercept/components/ErrorBoundary";
import { useErrorMonitor } from "../error_intercept/hooks/useErrorMonitor";
import { useNetworkMonitor } from "../error_intercept/hooks/useNetworkMonitor";

vi.mock("@sentry/react", () => ({
  init: vi.fn(),
  withScope: vi.fn((cb) => cb({ setTag: vi.fn(), setContext: vi.fn() })),
  captureException: vi.fn(),
  withErrorBoundary: vi.fn((component, options) => {
    const Wrapped = () => {
      try {
        return component();
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (error) {
        return options.fallback();
      }
    };
    return Wrapped;
  }),
  browserTracingIntegration: vi.fn(),
  replayIntegration: vi.fn(),
}));

describe("Error Monitoring", () => {
  const originalFetch = window.fetch;
  const originalXHR = XMLHttpRequest.prototype.open;

  beforeEach(() => {
    vi.clearAllMocks();
    console.error = vi.fn();
  });

  afterEach(() => {
    window.fetch = originalFetch;
    XMLHttpRequest.prototype.open = originalXHR;
    vi.restoreAllMocks();
  });

  describe("useNetworkMonitor", () => {
    const TestComponent = () => {
      const stats = useNetworkMonitor();
      return <div data-testid="stats">{JSON.stringify(stats)}</div>;
    };

    it("should track successful fetch calls", async () => {
      const mockResponse = new Response(null, { status: 200 });
      window.fetch = vi.fn().mockResolvedValue(mockResponse);

      render(<TestComponent />);

      await act(async () => {
        await fetch("https://test.com");
      });

      await waitFor(() => {
        const stats = JSON.parse(
          screen.getByTestId("stats").textContent || "{}"
        );
        expect(stats.calls["https://test.com"]).toHaveLength(1);
      });
    });

    it("should track fetch errors", async () => {
      window.fetch = vi.fn().mockRejectedValue(new Error("Network error"));

      render(<TestComponent />);

      await act(async () => {
        try {
          await fetch("https://test.com");
        } catch {
          // Expected error
        }
      });

      await waitFor(() => {
        const stats = JSON.parse(
          screen.getByTestId("stats").textContent || "{}"
        );
        expect(stats.errors).toHaveLength(1);
      });
    });

    it("should track XHR calls", async () => {
      render(<TestComponent />);

      const xhr = new XMLHttpRequest();
      xhr.open("GET", "https://test.com");

      act(() => {
        Object.defineProperty(xhr, "status", { value: 200 });
        xhr.dispatchEvent(new Event("load"));
      });

      await waitFor(() => {
        const stats = JSON.parse(
          screen.getByTestId("stats").textContent || "{}"
        );
        expect(stats.calls["https://test.com"]).toHaveLength(1);
      });
    });

    it("should track XHR errors", async () => {
      render(<TestComponent />);

      const xhr = new XMLHttpRequest();
      xhr.open("GET", "https://test.com");

      act(() => {
        xhr.dispatchEvent(new Event("error"));
      });

      await waitFor(() => {
        const stats = JSON.parse(
          screen.getByTestId("stats").textContent || "{}"
        );
        expect(stats.errors).toHaveLength(1);
      });
    });

    it("should handle XHR initialization failure", async () => {
      // Save original open method
      const originalOpen = XMLHttpRequest.prototype.open;
      // Set it to undefined to force error
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      XMLHttpRequest.prototype.open = undefined as any;

      render(<TestComponent />);
      const xhr = new XMLHttpRequest();

      expect(() => {
        xhr.open("GET", "https://test.com", true);
      }).toThrow("XHR interceptor not properly initialized");

      // Restore original
      XMLHttpRequest.prototype.open = originalOpen;
    });
  });

  describe("useErrorMonitor", () => {
    it("should initialize with empty stats when trackState is true", () => {
      const TestComponent = () => {
        const { networkStats } = useErrorMonitor({ trackState: true });
        return <div data-testid="stats">{networkStats.errors.length}</div>;
      };

      render(<TestComponent />);
      expect(screen.getByTestId("stats")).toHaveTextContent("0");
    });

    it("should return empty stats when trackState is false", () => {
      const TestComponent = () => {
        const { networkStats } = useErrorMonitor({ trackState: false });
        return <div data-testid="stats">{networkStats.errors.length}</div>;
      };

      render(<TestComponent />);
      expect(screen.getByTestId("stats")).toHaveTextContent("0");
    });

    it("should handle error with sampling", async () => {
      const TestComponent = () => {
        const { networkStats } = useErrorMonitor({
          captureNetwork: true,
          sampleRate: 1.0,
        });
        return <div data-testid="stats">{networkStats.errors.length}</div>;
      };

      window.fetch = vi.fn().mockRejectedValue(new Error("Test error"));

      render(<TestComponent />);

      await act(async () => {
        try {
          await fetch("https://test.com");
        } catch {
          // Expected error
        }
      });

      await waitFor(() => {
        expect(screen.getByTestId("stats")).toHaveTextContent("1");
      });
    });
  });

  //   describe("SentryErrorBoundary", () => {
  //     const DefaultFallback = () => <div>Something went wrong</div>;

  //     it("should render children when no error occurs", () => {
  //       render(
  //         <SentryErrorBoundary fallback={<DefaultFallback />}>
  //           <div>Normal content</div>
  //         </SentryErrorBoundary>
  //       );

  //       expect(screen.getByText("Normal content")).toBeInTheDocument();
  //     });

  //     it("should show children when error occurs with REPLACE_CONTENT_WITH_FALLBACK false", () => {
  //       const ErrorComponent = () => {
  //         throw new Error("Test error");
  //       };

  //       render(
  //         <SentryErrorBoundary fallback={<DefaultFallback />}>
  //           <div>Normal content</div>
  //           <ErrorComponent />
  //         </SentryErrorBoundary>
  //       );

  //       expect(screen.getByText("Normal content")).toBeInTheDocument();
  //     });

  //     it("should use provided fallback", () => {
  //       const CustomFallback = () => <div>Custom error</div>;
  //       const ErrorComponent = () => {
  //         throw new Error("Test error");
  //       };

  //       render(
  //         <SentryErrorBoundary fallback={<CustomFallback />}>
  //           <ErrorComponent />
  //         </SentryErrorBoundary>
  //       );

  //       expect(screen.getByText("Custom error")).toBeInTheDocument();
  //     });
  //   });
});
