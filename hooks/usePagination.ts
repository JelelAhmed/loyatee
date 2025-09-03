// hooks/usePagination.ts
import { useState, useMemo } from "react";

export function usePagination<T>(items: T[], pageSize: number = 10) {
  const [page, setPage] = useState(0);

  const totalPages = Math.ceil(items.length / pageSize);

  const pagedItems = useMemo(() => {
    const start = page * pageSize;
    return items.slice(start, start + pageSize);
  }, [items, page, pageSize]);

  const nextPage = () => setPage((p) => Math.min(totalPages - 1, p + 1));
  const prevPage = () => setPage((p) => Math.max(0, p - 1));
  const resetPage = () => setPage(0);

  return {
    page,
    setPage,
    totalPages,
    pagedItems,
    nextPage,
    prevPage,
    resetPage,
  };
}
