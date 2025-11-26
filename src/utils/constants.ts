/**
 * Constantes do projeto - Valores que não mudam
 */

// URL da API que contém a lista de ferramentas
export const API_URL = 'https://pluga.co/ferramentas_search.json';

// Quantidade de ferramentas por página
export const ITEMS_PER_PAGE = 12;

// Quantidade máxima de ferramentas no histórico de visualizações
export const MAX_HISTORY_ITEMS = 3;

// Chave para armazenar histórico no localStorage
export const HISTORY_STORAGE_KEY = 'pluga_view_history';

// Tempo de debounce da busca (em milissegundos)
export const SEARCH_DEBOUNCE_MS = 300;
