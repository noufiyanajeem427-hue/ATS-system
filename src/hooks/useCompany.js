import { useMemo } from 'react';

export function useCompany() {
  return useMemo(() => ({ ready: true }), []);
}
