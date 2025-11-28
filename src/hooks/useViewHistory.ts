import { useState, useCallback } from 'react';
import type { Tool } from '../types';
import { getViewHistory, addToViewHistory as saveToHistory } from '../services/storage';

export function useViewHistory(tools: Tool[]) {
  const [historyAppIds, setHistoryAppIds] = useState<string[]>(() => getViewHistory());

  // Função para adicionar ao histórico
  const addToHistory = useCallback(
    (tool: Tool) => {

      saveToHistory(tool.app_id);

      // Atualiza o estado local
      setHistoryAppIds((prev) => {
        const filtered = prev.filter((id) => id !== tool.app_id);
        return [tool.app_id, ...filtered];
      });
    },
    []
  );

  // Converte app_ids em objetos Tool completos
  const recentTools = historyAppIds
    .map((appId) => tools.find((tool) => tool.app_id === appId))
    .filter((tool) => tool !== undefined) as Tool[];

  return { recentTools, addToHistory };
}
