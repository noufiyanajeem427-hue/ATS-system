import { useMemo } from 'react';

export function useJobs() {
  return useMemo(() => ({ ready: true }), []);
}
