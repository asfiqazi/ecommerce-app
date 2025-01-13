import { useState, useEffect } from 'react';
import { logger } from '../utils/logger';

interface NetworkStatus {
  isOnline: boolean;
  type: string;
  downlink?: number;
  effectiveType?: string;
}

export function useNetworkStatus(): NetworkStatus {
  const [networkStatus, setNetworkStatus] = useState<NetworkStatus>({
    isOnline: navigator.onLine,
    type: 'unknown'
  });

  useEffect(() => {
    const handleOnline = () => {
      const connection = navigator.connection;
      setNetworkStatus({
        isOnline: true,
        type: connection?.type || 'unknown',
        downlink: connection?.downlink,
        effectiveType: connection?.effectiveType
      });
      logger.info('Network is back online');
    };

    const handleOffline = () => {
      setNetworkStatus({
        isOnline: false,
        type: 'offline'
      });
      logger.warn('Network connection lost');
    };

    // Add event listeners
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Check initial connection details
    const connection = navigator.connection;
    if (connection) {
      setNetworkStatus(prev => ({
        ...prev,
        type: connection.type || prev.type,
        downlink: connection.downlink,
        effectiveType: connection.effectiveType
      }));
    }

    // Cleanup listeners
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return networkStatus;
}
