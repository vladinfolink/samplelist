// src/types/monitoring.ts
export interface NetworkCall {
  url: string;
  timestamp: number;
  status?: number;
  error?: Error;
}

export interface NetworkStats {
  calls: Record<string, NetworkCall[]>;
  errors: NetworkCall[];
}

export interface ErrorSample {
  url?: string;
  timestamp: number;
}

export interface MonitoringConfig {
  captureNetwork?: boolean;
  sampleRate?: number;
  trackState?: boolean;
}

export interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}
