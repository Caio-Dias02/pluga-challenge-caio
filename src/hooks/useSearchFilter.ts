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

    if (!query.trim()) {
      return tools;
    }

    const normalizedQuery = query.trim().toLowerCase();

    return tools.filter((tool) => tool.name.toLowerCase().includes(normalizedQuery));
  }, [tools, query]);
}
