import { useMemo, useState, useCallback } from 'react';
import type { Tool } from '../types';

/**
 * Hook para paginar uma lista de ferramentas
 *
 * @param items - Array com todas as ferramentas
 * @param itemsPerPage - Quantidade por página (default: 12)
 * @returns { currentItems, totalPages, currentPage, goToPage, nextPage, prevPage }
 */
export function usePagination(items: Tool[], itemsPerPage: number = 12) {
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = useMemo(() => {
    return Math.ceil(items.length / itemsPerPage);
  }, [items.length, itemsPerPage]);

  const validPage = Math.min(currentPage, Math.max(1, totalPages));

  // Pega apenas as ferramentas da página atual
  const currentItems = useMemo(() => {
    const startIndex = (validPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;

    return items.slice(startIndex, endIndex);
  }, [items, validPage, itemsPerPage]);

  // Função para ir para uma página específica
  const goToPage = useCallback((page: number) => {
    const pageNum = Math.max(1, Math.min(page, totalPages));
    setCurrentPage(pageNum);
  }, [totalPages]);

  const nextPage = useCallback(() => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  }, [totalPages]);

  const prevPage = useCallback(() => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  }, []);

  return {
    currentItems,
    totalPages,
    currentPage: validPage,
    goToPage,
    nextPage,
    prevPage,
  };
}
