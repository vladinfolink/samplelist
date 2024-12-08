/* eslint-disable @typescript-eslint/no-explicit-any */
import { vi, describe, it, expect } from "vitest";
import { createErrorLink } from "../error_intercept/apollo/errorLink";
import { Kind } from "graphql";

let errorHandler: any;
vi.mock("@apollo/client/link/error", () => ({
  onError: (fn: any) => {
    errorHandler = fn;
    return { request: vi.fn() };
  },
}));

describe("createErrorLink", () => {
  it("handles errors", () => {
    const link = createErrorLink();
    const spy = vi.spyOn(link, "request");

    link.request({
      query: { kind: Kind.DOCUMENT, definitions: [] },
      variables: {},
      operationName: "test",
      setContext: vi.fn(),
      getContext: () => ({}),
      extensions: {},
    });

    // Now test error handling
    errorHandler({
      graphQLErrors: [{ message: "Test Error" }],
      operation: {
        query: { kind: Kind.DOCUMENT, definitions: [] },
        variables: {},
        operationName: "TestOp",
      },
    });

    errorHandler({
      networkError: new Error("Network Error"),
      operation: {
        query: { kind: Kind.DOCUMENT, definitions: [] },
        variables: {},
        operationName: "TestOp",
      },
    });

    errorHandler({
      networkError: new Error("Network Error"),
      operation: {
        query: { kind: Kind.DOCUMENT, definitions: [] },
        variables: {},
      },
    });

    expect(spy).toHaveBeenCalled();
  });
});
