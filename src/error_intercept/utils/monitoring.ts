// src/utils/monitoring.ts

// This file is no longer used

import { ErrorSample } from '../types/monitoring';

export const hashString = (str: string): number => {
  let hash = 5381;
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) + hash) + str.charCodeAt(i);
  }
  return hash >>> 0;  
};

export const createSampleKey = (data: ErrorSample): string => 
  [
    data.url,
    Math.floor(data.timestamp / 60000) * 60000
  ].filter(Boolean).join('|');

export const shouldSample = (data: ErrorSample, sampleRate: number): boolean => {
  if (sampleRate >= 1.0) return true;
  if (sampleRate <= 0.0) return false;

  const key = createSampleKey(data);
  const hashValue = hashString(key);
  return (hashValue % 100) < (sampleRate * 100);
};