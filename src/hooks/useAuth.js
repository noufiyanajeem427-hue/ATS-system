import { useMemo } from 'react';

export function useAuth() {
  return useMemo(() => ({ ready: true }), []);
}
