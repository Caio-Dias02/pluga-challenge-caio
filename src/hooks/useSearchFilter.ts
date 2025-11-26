import { useMemo } from 'react';
import type { Tool } from '../types';

/**
 * Hook para filtrar ferramentas por nome de busca
 *
 * @param tools - Array de ferramentas
 * @param query - Texto de busca do usuário
 * @returns Tool[] - Ferramentas filtradas
 */
export function useSearchFilter(tools: Tool[], query: string): Tool[] {
  return useMemo(() => {
    // Se não tem busca, retorna todas as ferramentas
    if (!query.trim()) {
      return tools;
    }

    // Normaliza a busca: remove espaços e coloca em minúsculas
    const normalizedQuery = query.trim().toLowerCase();

    // Filtra ferramentas que contêm o texto (case-insensitive)
    return tools.filter((tool) => tool.name.toLowerCase().includes(normalizedQuery));
  }, [tools, query]);
}
