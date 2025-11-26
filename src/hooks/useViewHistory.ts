import { useState, useEffect, useCallback } from 'react';
import type { Tool } from '../types';
import { getViewHistory, addToViewHistory as saveToHistory } from '../services/storage';

/**
 * Hook para gerenciar o histórico de ferramentas visualizadas
 *
 * Retorna: { recentTools, addToHistory }
 * - recentTools: Array com as 3 ferramentas mais recentes
 * - addToHistory: Função para adicionar uma ferramenta ao histórico
 */
export function useViewHistory(tools: Tool[]) {
  const [historyAppIds, setHistoryAppIds] = useState<string[]>([]);

  // Carrega histórico do localStorage ao montar
  useEffect(() => {
    const stored = getViewHistory();
    setHistoryAppIds(stored);
  }, []);

  // Função para adicionar ao histórico
  const addToHistory = useCallback(
    (tool: Tool) => {
      // Adiciona ao localStorage
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
