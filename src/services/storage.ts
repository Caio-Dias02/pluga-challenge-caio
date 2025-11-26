import { HISTORY_STORAGE_KEY, MAX_HISTORY_ITEMS } from '../utils/constants';

/**
 * Recupera o histórico de visualizações do localStorage
 *
 * @returns string[] - Array de app_ids (Ex: ["slack", "google_sheets"])
 */
export function getViewHistory(): string[] {
  try {
    const stored = localStorage.getItem(HISTORY_STORAGE_KEY);

    // Se não tiver nada guardado, retorna array vazio
    if (!stored) {
      return [];
    }

    // Converte a string JSON em array
    const history = JSON.parse(stored);

    // Valida se é realmente um array
    if (!Array.isArray(history)) {
      return [];
    }

    // Limita a MAX_HISTORY_ITEMS (remove dados legados que possam ter mais)
    if (history.length > MAX_HISTORY_ITEMS) {
      const trimmed = history.slice(0, MAX_HISTORY_ITEMS);
      saveViewHistory(trimmed);
      return trimmed;
    }

    return history;
  } catch (error) {
    console.error('Erro ao recuperar histórico:', error);
    return [];
  }
}

/**
 * Salva o histórico de visualizações no localStorage
 *
 * @param appIds - Array de app_ids para guardar
 */
export function saveViewHistory(appIds: string[]): void {
  try {
    // Limita a MAX_HISTORY_ITEMS (3 itens)
    const trimmed = appIds.slice(0, MAX_HISTORY_ITEMS);

    // Converte array em string JSON e salva
    localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(trimmed));
  } catch (error) {
    console.error('Erro ao salvar histórico:', error);
  }
}

/**
 * Adiciona uma ferramenta ao histórico
 *
 * Lógica:
 * 1. Carrega histórico atual
 * 2. Remove se já existe (para não duplicar)
 * 3. Coloca no início do array (mais recente)
 * 4. Limita a 3 itens máximo
 * 5. Salva
 *
 * @param appId - app_id da ferramenta a adicionar
 */
export function addToViewHistory(appId: string): void {
  try {
    // 1. Carrega histórico
    const history = getViewHistory();

    // 2. Remove se já existe (evita duplicata)
    const filtered = history.filter((id) => id !== appId);

    // 3. Coloca no início
    const updated = [appId, ...filtered];

    // 4. Salva
    saveViewHistory(updated);
  } catch (error) {
    console.error('Erro ao adicionar ao histórico:', error);
  }
}

/**
 * Limpa todo o histórico de visualizações
 */
export function clearViewHistory(): void {
  try {
    localStorage.removeItem(HISTORY_STORAGE_KEY);
  } catch (error) {
    console.error('Erro ao limpar histórico:', error);
  }
}
