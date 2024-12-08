# Frontend Error Monitoring System

## Overview
A lightweight error monitoring solution for React applications that integrates with Sentry. The system captures:
- Network errors (Fetch and XMLHttpRequest)
- Uncaught exceptions
- React component errors
- Manual error throws

## Setup

1. Install Sentry:
```bash
npm install @sentry/react
```

2. Configure environment variables in `.env`:
```
VITE_SENTRY_DSN=your_sentry_dsn_here
```

3. Initialize Sentry in your app entry point:
```typescript
// main.tsx
import { initializeSentry } from './utils/sentry';
import { ErrorBoundary } from './components/ErrorBoundary';

initializeSentry();

const App = () => (
  <ErrorBoundary>
    <YourApp />
  </ErrorBoundary>
);
```

## Error Capture Types

### 1. Network Errors
- Automatically captured through network interceptors
- Includes failed Fetch and XMLHttpRequest calls
- Configurable sampling rate

### 2. React Component Errors
- Caught by ErrorBoundary component
- Prevents white screen crashes
- Provides fallback UI

### 3. Uncaught Exceptions
- Automatically captured by Sentry
- Includes runtime errors
- Stack traces preserved

### 4. Manual Error Tracking
```typescript
try {
  // Your code
} catch (error) {
  captureError(error, {
    // Additional context
    url: 'relevant-url',
    timestamp: Date.now()
  });
}
```

## Usage Examples

### Error Monitoring with Network Stats
```typescript
const YourComponent = () => {
  const { networkStats } = useErrorMonitor({
    captureNetwork: true,
    sampleRate: 0.5 // Report 50% of network errors
  });

  const handleRiskyOperation = () => {
    try {
      // Some risky operation
      throw new Error('Something went wrong');
    } catch (error) {
      // This will be caught by Sentry
      throw error;
    }
  };

  return (
    <div>
      <div>Network Errors: {networkStats.errors.length}</div>
      <button onClick={handleRiskyOperation}>
        Try Risky Operation
      </button>
    </div>
  );
};
```

### Error Boundary Usage
```typescript
const App = () => (
  <ErrorBoundary 
    fallback={
      <div>
        <h2>Something went wrong</h2>
        <button onClick={() => window.location.reload()}>
          Retry
        </button>
      </div>
    }
  >
    <YourApp />
  </ErrorBoundary>
);
```

## Configuration Options

```typescript
// Error Monitor Configuration
interface MonitoringConfig {
  captureNetwork?: boolean;  // Default: true
  sampleRate?: number;       // Default: 1.0 (only affects network errors)
}

// Error Boundary Props
interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}
```

## Best Practices

1. **Error Sampling**
   - Only affects network errors
   - Other errors are always captured
   - Adjust sampling based on traffic volume

2. **Error Boundaries**
   - Use multiple boundaries for different sections
   - Provide contextual fallback UIs
   - Always have a root boundary

3. **Error Context**
   - Add relevant c