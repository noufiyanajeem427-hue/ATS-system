import { useMemo } from 'react';

export function useApplicants() {
  return useMemo(() => ({ ready: true }), []);
}
