// src/apollo/client.ts
import { ApolloClient, InMemoryCache, HttpLink, from } from "@apollo/client";
import { createErrorLink } from "./errorLink";

export const createApolloClient = (uri: string) => {
  const errorLink = createErrorLink();
  const httpLink = new HttpLink({ uri });

  return new ApolloClient({
    link: from([errorLink, httpLink]),
    cache: new InMemoryCache(),
    defaultOptions: {
      watchQuery: {
        errorPolicy: "all",
      },
      query: {
        errorPolicy: "all",
      },
      mutate: {
        errorPolicy: "all",
      },
    },
  });
};
