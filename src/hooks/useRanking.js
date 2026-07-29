import { useMemo } from 'react';

export function useRanking() {
  return useMemo(() => ({ ready: true }), []);
}
