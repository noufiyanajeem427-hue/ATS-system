import { useMemo } from 'react';

export function useInterviews() {
  return useMemo(() => ({ ready: true }), []);
}
