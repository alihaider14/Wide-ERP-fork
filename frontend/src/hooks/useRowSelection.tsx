import { useState, useMemo, useCallback } from "react";

export function useRowSelection<T>(
  data: T[],
  getKey: (row: T, idx: number) => string
) {
  const [selectedKeys, setSelectedKeys] = useState<Set<string>>(new Set());

  const pageKeys = useMemo(() => data.map((row, idx) => getKey(row, idx)), [data, getKey]);

  const isRowSelected = useCallback(
    (key: string) => selectedKeys.has(key),
    [selectedKeys]
  );

  const toggleRow = useCallback((key: string) => {
    setSelectedKeys(prev => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  }, []);

  const clearSelection = useCallback(() => setSelectedKeys(new Set()), []);

  const allSelectedOnPage =
    pageKeys.length > 0 && pageKeys.every(k => selectedKeys.has(k));

  const toggleAllOnPage = useCallback(() => {
    setSelectedKeys(prev => {
      const next = new Set(prev);
      if (allSelectedOnPage) {
        pageKeys.forEach(k => next.delete(k));
      } else {
        pageKeys.forEach(k => next.add(k));
      }
      return next;
    });
  }, [allSelectedOnPage, pageKeys]);

  return {
    selectedKeys,
    selectedCount: selectedKeys.size,
    isRowSelected,
    toggleRow,
    clearSelection,
    allSelectedOnPage,
    toggleAllOnPage,
  };
}
