import { renderHook, waitFor } from '@testing-library/react';
import { useToolsData } from './useToolsData';
import type { Tool } from '../types';

// ============================================
// MOCK DO FETCH GLOBAL
// ============================================
// Substitui o fetch de verdade por um fake
// Assim controlamos o que a API "retorna" em cada teste

global.fetch = jest.fn();

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
    app_id: 'github',
    name: 'GitHub',
    icon: 'https://example.com/github.png',
    color: '#333333',
    link: 'https://github.com',
  },
];

describe('useToolsData', () => {
  // Limpa o mock antes de cada teste
  // Garante que um teste não afeta outro
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // ========== TESTE 1: Fetch Bem-Sucedido ==========
  // API retorna 200 + dados
  // Hook: loading=true→false, tools preenchido
  it('should fetch tools successfully', async () => {
    // Configura o mock para retornar sucesso
    // ok: true = status 200-299
    // json() = retorna dados
    (fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => mockTools,
    });

    const { result } = renderHook(() => useToolsData());

    // No início, está loading
    expect(result.current.loading).toBe(true);
    expect(result.current.tools).toEqual([]);
    expect(result.current.error).toBeNull();

    // Espera o fetch completar
    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    // Depois, tem dados
    expect(result.current.tools).toEqual(mockTools);
    expect(result.current.error).toBeNull();
  });

  // ========== TESTE 2: Erro de Rede ==========
  // Fetch rejeita (sem internet?)
  // Hook: loading=false, error preenchido, tools=[]
  it('should handle network errors', async () => {
    // Configura o mock para rejeitar
    const networkError = new Error('Network error');
    (fetch as jest.Mock).mockRejectedValue(networkError);

    const { result } = renderHook(() => useToolsData());

    // Espera completar com erro
    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    // Tem erro
    expect(result.current.error).toBeTruthy();
    expect(result.current.tools).toEqual([]);
  });

  // ========== TESTE 3: Status Não-200 ==========
  // API retorna 404 ou 500
  // Hook: loading=false, error definido
  it('should handle non-200 status codes', async () => {
    (fetch as jest.Mock).mockResolvedValue({
      ok: false,
      status: 404,
      statusText: 'Not Found',
    });

    const { result } = renderHook(() => useToolsData());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    // Tem erro
    expect(result.current.error).toBeTruthy();
    expect(result.current.tools).toEqual([]);
  });

  // ========== TESTE 4: Loading State Transitions ==========
  // Verifica: loading=true → true → false
  it('should have correct loading state transitions', async () => {
    (fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => mockTools,
    });

    const { result } = renderHook(() => useToolsData());

    // Imediatamente, está loading
    expect(result.current.loading).toBe(true);

    // Espera completar
    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    // Confirmação final
    expect(result.current.tools).toEqual(mockTools);
  });

  // ========== TESTE 5: JSON Inválido ==========
  // API retorna 200 mas JSON corrompido
  it('should handle invalid JSON response', async () => {
    (fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => {
        throw new Error('Invalid JSON');
      },
    });

    const { result } = renderHook(() => useToolsData());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    // Tem erro
    expect(result.current.error).toBeTruthy();
    expect(result.current.tools).toEqual([]);
  });

  // ========== TESTE 6: Fetch é Chamado Corretamente ==========
  // Verifica: fetch foi chamado com URL correta?
  it('should call fetch with correct URL', async () => {
    (fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => mockTools,
    });

    renderHook(() => useToolsData());

    // Aguarda o fetch ser chamado
    await waitFor(() => {
      expect(fetch).toHaveBeenCalled();
    });

    // Verifica a URL
    expect(fetch).toHaveBeenCalledWith(
      'https://pluga.co/ferramentas_search.json'
    );
  });

  // ========== TESTE 7: Array Vazio ==========
  // API retorna 200 mas array vazio []
  it('should handle empty tools array', async () => {
    (fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => [],
    });

    const { result } = renderHook(() => useToolsData());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.tools).toEqual([]);
    expect(result.current.error).toBeNull();
  });
});
