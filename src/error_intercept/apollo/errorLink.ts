// src/apollo/errorLink.ts
import { onError } from "@apollo/client/link/error";

// Use a type that matches Apollo's error structure
interface ApolloGraphQLError {
  message: string;
  locations?: readonly { line: number; column: number }[];
  path?: readonly (string | number)[];
  extensions?: Record<string, unknown>;
}

const formatGraphQLError = (error: ApolloGraphQLError) => ({
  message: error.message,
  locations: error.locations,
  path: error.path,
  extensions: error.extensions,
});

export const createErrorLink = () => {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const Sentry = require("@sentry/react");

  return onError(({ graphQLErrors, networkError, operation }) => {
    if (graphQLErrors) {
      graphQLErrors.forEach((error) => {
        // Capture each GraphQL error as a separate Sentry event
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        Sentry.withScope((scope: any) => {
          scope.setTag("type", "graphql_error");
          scope.setTag(
            "operation",
            operation.operationName || "unnamed_operation"
          );

          scope.setContext("graphql", {
            error: formatGraphQLError(error),
            operation: {
              name: operation.operationName,
              type: operation.query.kind,
              variables: operation.variables,
            },
          });

          Sentry.captureException(new Error(`GraphQL Error: ${error.message}`));
        });
      });
    }

    if (networkError) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      Sentry.withScope((scope: any) => {
        scope.setTag("type", "apollo_network_error");
        scope.setTag(
          "operation",
          operation.operationName || "unnamed_operation"
        );

        scope.setContext("network", {
          operation: {
            name: operation.operationName,
            type: operation.query.kind,
            variables: operation.variables,
          },
        });

        Sentry.captureException(networkError);
      });
    }
  });
};
