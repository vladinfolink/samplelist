// src/hooks/useErrorMonitor.ts
import { useEffect } from 'react';
import { useNetworkMonitor } from './useNetworkMonitor';
import { captureError } from '../utils/sentry';
import { shouldSample } from '../utils/monitoring';
import { MonitoringConfig } from '../types/monitoring';

export const useErrorMonitor = (config: MonitoringConfig = {}) => {
  const {
    captureNetwork = true,
    sampleRate = 1.0,
    trackState = true    // Default to true for backward compatibility
  } = config;

  const networkStats = useNetworkMonitor();

  useEffect(() => {
    if (captureNetwork) {
      for (const error of networkStats.errors) {
        if (shouldSample({
          url: error.url,
          timestamp: error.timestamp
        }, sampleRate)) {
          captureError(error.error, {
            url: error.url,
            timestamp: error.timestamp
          });
        }
      }
    }
  }, [networkStats.errors, captureNetwork, sampleRate]);

  // Return null or empty stats object if not tracking state
  return trackState 
    ? { networkStats }
    : { networkStats: { calls: {}, errors: [] } };
};