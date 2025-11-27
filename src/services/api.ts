import type { Tool } from '../types';
import { API_URL } from '../utils/constants';

/**
 * Busca a lista de ferramentas da API da Pluga
 *
 * @returns Promise<Tool[]> - Array com todas as ferramentas
 * @throws Error - Se a requisição falhar
 */
export async function fetchTools(): Promise<Tool[]> {
  try {
    const response = await fetch(API_URL);

    if (!response.ok) {
      throw new Error(`Erro ao buscar ferramentas: ${response.status}`);
    }

    const tools: Tool[] = await response.json();

    return tools;
  } catch (error) {
    console.error('Erro ao buscar ferramentas:', error);
    throw error;
  }
}
