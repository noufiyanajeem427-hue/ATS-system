import { useMemo } from 'react';

export function useEmail() {
  return useMemo(() => ({ ready: true }), []);
}
