# Error Handling & Connection Status

Building reliable Home Assistant interfaces requires proper error handling and connection management. hass-react provides comprehensive tools for managing errors and monitoring connection status.

## Connection Status with useHAConnection

The `useHAConnection` hook provides complete access to your Home Assistant connection state:

```tsx
import { useHAConnection } from 'hass-react';

function ConnectionStatus() {
  const { 
    connected, 
    connecting, 
    error, 
    connectionState,
    retryCount,
    nextRetryIn,
    isAutoRetrying,
    reconnect,
    config 
  } = useHAConnection();

  if (connecting) {
    return <div>Connecting to Home Assistant...</div>;
  }

  if (error) {
    return (
      <div className="error">
        <p>Connection Error: {error.message}</p>
        <button onClick={reconnect}>Retry Connection</button>
      </div>
    );
  }

  if (!connected) {
    return <div>Disconnected from Home Assistant</div>;
  }

  return (
    <div className="status">
      <p>Connected to {config.url}</p>
      <p>Retry count: {retryCount}</p>
      {isAutoRetrying && nextRetryIn && (
        <p>Auto-retry in {Math.ceil(nextRetryIn / 1000)} seconds</p>
      )}
    </div>
  );
}
```

## Connection States

The `connectionState` property provides detailed status information:

```tsx
function DetailedConnectionStatus() {
  const { connectionState, connected, connecting, error } = useHAConnection();

  const getStatusMessage = () => {
    switch (connectionState) {
      case 'idle':
        return 'Ready to connect';
      case 'connecting':
        return 'Establishing connection...';
      case 'connected':
        return 'Successfully connected';
      case 'disconnected':
        return 'Connection lost';
      case 'error':
        return `Connection failed: ${error?.message}`;
      default:
        return 'Unknown status';
    }
  };

  const getStatusColor = () => {
    switch (connectionState) {
      case 'connected':
        return 'green';
      case 'connecting':
        return 'orange';
      case 'error':
        return 'red';
      default:
        return 'gray';
    }
  };

  return (
    <div style={{ color: getStatusColor() }}>
      <strong>{getStatusMessage()}</strong>
    </div>
  );
}
```

## Error Types and Handling

hass-react provides specific error types to help you handle different scenarios appropriately:

### Connection Errors

```tsx
import { ConnectionError } from 'hass-react';

function LightControl() {
  const light = useLight('light.living_room');
  const [error, setError] = useState(null);

  const handleToggle = async () => {
    try {
      await light.toggle();
      setError(null);
    } catch (err) {
      if (err instanceof ConnectionError) {
        setError('Not connected to Home Assistant. Please check your connection.');
      } else {
        setError(`Failed to toggle light: ${err.message}`);
      }
    }
  };

  return (
    <div>
      <button onClick={handleToggle}>
        Toggle Light
      </button>
      {error && (
        <div className="error">{error}</div>
      )}
    </div>
  );
}
```

### Entity Availability Errors

```tsx
function RobustSensorDisplay() {
  const sensor = useSensor('sensor.temperature');
  const { connected } = useHAConnection();

  // Check for entity-level errors
  if (sensor.error) {
    return (
      <div className="warning">
        <h3>Sensor Unavailable</h3>
        <p>{sensor.error.message}</p>
        {connected && (
          <p>The sensor may not exist or be temporarily offline.</p>
        )}
      </div>
    );
  }

  // Check for connection issues
  if (!connected) {
    return (
      <div className="info">
        <p>Waiting for Home Assistant connection...</p>
      </div>
    );
  }

  return (
    <div>
      <h3>Temperature</h3>
      <p>{sensor.value}° {sensor.unitOfMeasurement}</p>
    </div>
  );
}
```

### Feature Support Errors

```tsx
function SmartLightControl() {
  const light = useLight('light.smart_bulb');
  const [error, setError] = useState(null);

  const handleColorChange = async (color) => {
    if (!light.supportsRgb) {
      setError('This light does not support color changes');
      return;
    }

    try {
      await light.setRgbColor(color);
      setError(null);
    } catch (err) {
      setError(`Failed to change color: ${err.message}`);
    }
  };

  return (
    <div>
      <h3>Smart Light</h3>
      <button onClick={() => light.toggle()}>
        {light.isOn ? 'Turn Off' : 'Turn On'}
      </button>
      
      {light.supportsRgb && (
        <button onClick={() => handleColorChange([255, 0, 0])}>
          Set Red
        </button>
      )}
      
      {error && <div className="error">{error}</div>}
    </div>
  );
}
```

## Error Recovery Patterns

### Automatic Retry with Exponential Backoff

```tsx
function RetryableServiceCall() {
  const light = useLight('light.bedroom');
  const [isRetrying, setIsRetrying] = useState(false);
  const [retryCount, setRetryCount] = useState(0);

  const callServiceWithRetry = async (action, maxRetries = 3) => {
    for (let attempt = 0; attempt < maxRetries; attempt++) {
      try {
        setIsRetrying(attempt > 0);
        setRetryCount(attempt);
        
        await action();
        
        // Success - reset state
        setIsRetrying(false);
        setRetryCount(0);
        return;
        
      } catch (error) {
        const isLastAttempt = attempt === maxRetries - 1;
        
        if (isLastAttempt) {
          setIsRetrying(false);
          throw error; // Final failure
        }
        
        // Wait before retry with exponential backoff
        const delay = Math.pow(2, attempt) * 1000;
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  };

  const handleAction = async () => {
    try {
      await callServiceWithRetry(() => light.toggle());
    } catch (error) {
      console.error('Failed after all retries:', error);
    }
  };

  return (
    <div>
      <button onClick={handleAction} disabled={isRetrying}>
        {isRetrying ? `Retrying... (${retryCount + 1}/3)` : 'Toggle Light'}
      </button>
    </div>
  );
}
```

### Connection Recovery UI

```tsx
function App() {
  const { connected, connecting, error, reconnect, isAutoRetrying, nextRetryIn } = useHAConnection();

  if (!connected && !connecting) {
    return (
      <div className="connection-lost">
        <h2>Connection Lost</h2>
        <p>Unable to connect to Home Assistant</p>
        
        {error && (
          <div className="error-details">
            <p>Error: {error.message}</p>
          </div>
        )}
        
        {isAutoRetrying ? (
          <div className="auto-retry">
            <p>Auto-retrying in {Math.ceil((nextRetryIn || 0) / 1000)} seconds...</p>
            <button onClick={reconnect}>Retry Now</button>
          </div>
        ) : (
          <button onClick={reconnect}>Reconnect</button>
        )}
      </div>
    );
  }

  return <YourMainApp />;
}
```

## Global Error Boundary

For handling unexpected errors throughout your app:

```tsx
import { ErrorBoundary } from 'react-error-boundary';

function ErrorFallback({ error, resetErrorBoundary }) {
  const { connected, reconnect } = useHAConnection();

  return (
    <div className="error-boundary">
      <h2>Something went wrong</h2>
      <details>
        <summary>Error details</summary>
        <pre>{error.message}</pre>
      </details>
      
      {!connected ? (
        <div>
          <p>You appear to be disconnected from Home Assistant.</p>
          <button onClick={reconnect}>Reconnect</button>
        </div>
      ) : (
        <button onClick={resetErrorBoundary}>Try Again</button>
      )}
    </div>
  );
}

function App() {
  return (
    <HAProvider url="http://homeassistant.local:8123">
      <ErrorBoundary FallbackComponent={ErrorFallback}>
        <YourApp />
      </ErrorBoundary>
    </HAProvider>
  );
}
```

## Best Practices

### 1. Always Check Connection Status
```tsx
function MyComponent() {
  const { connected } = useHAConnection();
  const light = useLight('light.living_room');

  // Don't render controls when disconnected
  if (!connected) {
    return <div>Connecting to Home Assistant...</div>;
  }

  return <LightControls light={light} />;
}
```

### 2. Handle Entity Errors Gracefully
```tsx
function EntityDisplay({ entityId }) {
  const entity = useEntity(entityId);
  
  if (entity.error) {
    return (
      <div className="entity-error">
        <p>Warning: {entity.attributes.friendly_name || entityId}</p>
        <small>{entity.error.message}</small>
      </div>
    );
  }

  return (
    <div className="entity-display">
      <p>{entity.attributes.friendly_name || entityId}</p>
      <p>State: {entity.state}</p>
    </div>
  );
}
```

### 3. Provide User Feedback for Actions
```tsx
function LightControl() {
  const light = useLight('light.living_room');
  const [error, setError] = useState(null);

  const handleToggle = async () => {
    try {
      await light.toggle();
      setError(null); // Clear any previous errors
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div>
      <button onClick={handleToggle}>
        {light.isOn ? 'Turn Off' : 'Turn On'}
      </button>
      {error && (
        <div className="error-message">
          Failed to toggle light: {error}
        </div>
      )}
    </div>
  );
}
```

With proper error handling and connection management, your Home Assistant interface will be robust and provide a great user experience even when network issues occur.