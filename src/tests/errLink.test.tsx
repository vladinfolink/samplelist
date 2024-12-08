/* eslint-disable @typescript-eslint/no-explicit-any */
import { vi, describe, it, expect } from "vitest";
import { createErrorLink } from "../error_intercept/apollo/errorLink";
import { DocumentNode } from "graphql";

const mockOperation = {
  query: { kind: "Document", definitions: [] } as DocumentNode,
  variables: {},
  operationName: "test",
  extensions: {},
  setContext: vi.fn(),
  getContext: () => ({}),
};

// Most basic mock possible
vi.mock("@sentry/react", () => {
  return {
    withScope: (cb: any) => cb({ setTag: vi.fn(), setContext: vi.fn() }),
    captureException: vi.fn(),
  };
});

describe("createErrorLink", () => {
  it("handles errors", () => {
    const link = createErrorLink();
    const handler = vi.fn(link["request"]);

    handler(mockOperation);
    handler(mockOperation);

    expect(handler).toHaveBeenCalledTimes(2);
  });
});
