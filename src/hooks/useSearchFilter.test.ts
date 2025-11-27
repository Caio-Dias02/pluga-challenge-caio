import { renderHook } from '@testing-library/react';
import { useSearchFilter } from './useSearchFilter';
import type { Tool } from '../types';

// ============================================
// DADOS MOCK
// ============================================
const mockTools: Tool[] = [
  {
    app_id: 'slack',
    name: 'Slack',
    icon: 'https://example.com/slack.png',
    color: '#36C5F0',
    link: 'https://slack.com',
  },
  {
    app_id: 'trello',
    name: 'Trello',
    icon: 'https://example.com/trello.png',
    color: '#0079BF',
    link: 'https://trello.com',
  },
  {
    app_id: 'github',
    name: 'GitHub',
    icon: 'https://example.com/github.png',
    color: '#333333',
    link: 'https://github.com',
  },
  {
    app_id: 'google-sheets',
    name: 'Google Sheets',
    icon: 'https://example.com/sheets.png',
    color: '#34A853',
    link: 'https://sheets.google.com',
  },
];

describe('useSearchFilter', () => {
  // ========== TESTE 1: Query Vazia Retorna Tudo ==========
  // Quando não digita nada, vê todas as ferramentas?
  it('should return all tools when query is empty', () => {
    const { result } = renderHook(() => useSearchFilter(mockTools, ''));

    expect(result.current).toHaveLength(4);
    expect(result.current).toEqual(mockTools);
  });

  // ========== TESTE 2: Busca Case-Insensitive ==========
  // Digita "SLACK" (maiúscula) e encontra "Slack"?
  it('should filter case-insensitively', () => {
    const { result } = renderHook(() => useSearchFilter(mockTools, 'SLACK'));

    expect(result.current).toHaveLength(1);
    expect(result.current[0].name).toBe('Slack');
  });

  // ========== TESTE 3: Match Parcial ==========
  // Digita "goo" e encontra "Google Sheets"?
  it('should find partial matches', () => {
    const { result } = renderHook(() =>
      useSearchFilter(mockTools, 'goo')
    );

    expect(result.current).toHaveLength(1);
    expect(result.current[0].name).toBe('Google Sheets');
  });

  // ========== TESTE 4: Remove Espaços ==========
  // Digita "  slack  " (com espaços) e encontra?
  it('should trim whitespace from query', () => {
    const { result } = renderHook(() =>
      useSearchFilter(mockTools, '  slack  ')
    );

    expect(result.current).toHaveLength(1);
    expect(result.current[0].name).toBe('Slack');
  });

  // ========== TESTE 5: Sem Resultados ==========
  // Digita algo que não existe, retorna vazio?
  it('should return empty array when no matches', () => {
    const { result } = renderHook(() =>
      useSearchFilter(mockTools, 'nonexistent')
    );

    expect(result.current).toHaveLength(0);
  });

  // ========== TESTE 6: Query com Só Espaços ==========
  // Digita "   " (só espaços), trata como vazio?
  it('should treat whitespace-only query as empty', () => {
    const { result } = renderHook(() =>
      useSearchFilter(mockTools, '   ')
    );

    expect(result.current).toHaveLength(4); // Retorna tudo
  });

  // ========== TESTE 7: Múltiplos Matches ==========
  // Digita "g" encontra "GitHub" E "Google Sheets"?
  it('should find multiple matches', () => {
    const { result } = renderHook(() => useSearchFilter(mockTools, 'g'));

    expect(result.current).toHaveLength(2);
    expect(result.current.map((t) => t.name)).toContain('GitHub');
    expect(result.current.map((t) => t.name)).toContain('Google Sheets');
  });

  // ========== TESTE 8: Busca no Começo ==========
  // Digita "tr" encontra "Trello" (começa com tr)?
  it('should match from the beginning of name', () => {
    const { result } = renderHook(() => useSearchFilter(mockTools, 'tr'));

    expect(result.current).toHaveLength(1);
    expect(result.current[0].name).toBe('Trello');
  });

  // ========== TESTE 9: Busca no Meio ==========
  // Digita "ack" encontra "Slack"?
  it('should match in the middle of name', () => {
    const { result } = renderHook(() => useSearchFilter(mockTools, 'ack'));

    expect(result.current).toHaveLength(1);
    expect(result.current[0].name).toBe('Slack');
  });
});
