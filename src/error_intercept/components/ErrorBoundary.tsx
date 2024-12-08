// src/components/ErrorBoundary.tsx
import React, { ReactElement } from "react";
import { ErrorBoundaryProps } from "../types/monitoring";
import { useErrorBoundary } from "../utils/sentry";

interface Props {
  children: ReactElement;
  fallback: ReactElement;
}

export const SentryErrorBoundary: React.FC<Props> = ({
  children,
  fallback,
}) => {
  const WrappedComponent = () => children;

  const Component = useErrorBoundary(WrappedComponent, {
    fallback,
  });

  return <Component />;
};