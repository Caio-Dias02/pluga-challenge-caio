import { useState, useEffect } from "react";
import type { Tool } from "../types";
import { fetchTools } from "../services/api";

/**
 * Hook para buscar a lista de ferramentas da API
 *
 * Retorna: { tools, loading, error }
 * - tools: Array com todas as ferramentas
 * - loading: true enquanto está buscando
 * - error: Mensagem de erro (null se OK)
 */
export function useToolsData() {
  const [tools, setTools] = useState<Tool[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        setError(null);

        const data = await fetchTools();
        setTools(data);
      } catch (err) {
        // Se erro, armazena a mensagem
        setError(err instanceof Error ? err : new Error("Erro desconhecido"));
      } finally {

        setLoading(false);
      }
    };

    load();
  }, []);

  return { tools, loading, error };
}
