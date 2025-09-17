import { useEffect } from 'react';

export function useFrameworkReady() {
  useEffect(() => {
    // No-op for native platforms, but maintains hook consistency
  }, [])
}
