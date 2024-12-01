// hooks/useFilters.ts
import { useState, useCallback } from 'react';

interface Filters {
  location: string;
  rating: number;
}

export function useFilters(initialFilters: Filters) {
  const [filters, setFilters] = useState<Filters>(initialFilters);

  const updateFilters = useCallback((newFilters: Partial<Filters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  }, []);

  const resetFilters = useCallback(() => {
    setFilters({ location: '', rating: 0 });
  }, []);

  return {
    filters,
    updateFilters,
    resetFilters,
  };
}