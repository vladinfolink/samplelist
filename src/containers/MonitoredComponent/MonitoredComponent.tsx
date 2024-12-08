// src/components/MonitoredComponent.tsx
import { useErrorMonitor } from '../../error_intercept/hooks/useErrorMonitor';

export const MonitoredComponent = () => {
  const { networkStats } = useErrorMonitor({
    sampleRate: 0.5,
    captureNetwork: true
  });

  const handleTestError = async () => {
    try {
      await fetch('https://invalid-url.example');
    } catch (error) {
      console.error('Expected test error:', error);
      throw new Error('Expected test error zzz');
    }
  };

  console.log(networkStats);
  

  return (
    <div className="p-4">
      {JSON.stringify(networkStats)}
      <h2 className="text-xl font-bold mb-4">Error Monitoring Demo</h2>

      <div className="mb-4">
        <div>Network Errors: {networkStats.errors.length}</div>
      </div>

      <button
        onClick={handleTestError}
        className="px-4 py-2 bg-blue-500 text-white rounded"
      >
        Test Error Handling
      </button>
    </div>
  );
};