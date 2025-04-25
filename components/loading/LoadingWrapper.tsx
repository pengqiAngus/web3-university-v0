'use client';

import { LoadingProvider } from '@/lib/context/LoadingContext';
import LoadingOverlay from './LoadingOverlay';  
import { useState, ReactNode, useEffect } from 'react';
import { useGlobalLoading } from '@/lib/hooks/use-global-loading';

interface LoadingWrapperProps {
  children: ReactNode;
}

export default function LoadingWrapper({ children }: LoadingWrapperProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('Loading...');
  const isQueryLoading = useGlobalLoading();

  const showLoading = (customMessage?: string) => {
    setMessage(customMessage || 'Loading...');
    setIsLoading(true);
  };

  const hideLoading = () => {
    setIsLoading(false);
  };

  const loadingValue = {
    isLoading,
    message,
    showLoading,
    hideLoading,
  };

  return (
    <LoadingProvider value={loadingValue}>
      {children}
      <LoadingOverlay isVisible={isLoading || isQueryLoading} message={message} />
    </LoadingProvider>
  );
}
