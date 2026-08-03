import { useMemo } from 'react';

export function useAnalytics() {
  
  return useMemo(() => ({ ready: true }), []);
}
