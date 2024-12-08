import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { ErrorBoundary } from "@sentry/react";
import React from "react";

let shouldShowError = false;

vi.mock("@sentry/react", () => {
  return {
    ErrorBoundary: ({
      children,
      fallback,
    }: {
      children: React.ReactNode;
      fallback: React.ReactNode;
    }) => {
      return shouldShowError ? fallback : children;
    },
  };
});

describe("ErrorBoundary", () => {
  beforeEach(() => {
    shouldShowError = false;
  });

  it("renders children normally", () => {
    render(
      <ErrorBoundary fallback={<div>Error</div>}>
        <div>Normal content</div>
      </ErrorBoundary>
    );

    expect(screen.getByText("Normal content")).toBeInTheDocument();
  });

  it("renders fallback on error", () => {
    shouldShowError = true;

    render(
      <ErrorBoundary fallback={<div>Error</div>}>
        <div>Normal content</div>
      </ErrorBoundary>
    );

    expect(screen.getByText("Error")).toBeInTheDocument();
  });
});
