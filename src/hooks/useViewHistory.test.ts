import { renderHook, act, waitFor } from '@testing-library/react';
import { useViewHistory } from './useViewHistory';
import * as storage from '../services/storage';
import type { Tool } from '../types';

// ============================================
// MOCK DO SERVICE DE STORAGE
// ============================================
// jest.mock() substitui o módulo real por um fake
// Assim controlamos o que ele retorna em cada teste

jest.mock('../services/storage');

// ============================================
// DADOS MOCK
// ============================================
const createMockTools = (count: number): Tool[] => {
  return Array.from({ length: count }, (_, i) => ({
    app_id: `app-${i}`,
    name: `App ${i}`,
    icon: `https://example.com/icon-${i}.png`,
    color: '#000000',
    link: `https://example.com/app-${i}`,
  }));
};

describe('useViewHistory', () => {
  const mockTools = createMockTools(10);

  // Limpa mocks antes de cada teste
  // Garante que um teste não afeta outro
  beforeEach(() => {
    jest.clearAllMocks();
    // Reset das funções mock
    (storage.getViewHistory as jest.Mock).mockReset();
    (storage.addToViewHistory as jest.Mock).mockReset();
  });

  // ========== TESTE 1: localStorage Vazio ==========
  // Quando localStorage tá vazio, recentTools = []?
  it('should return empty array when localStorage is empty', async () => {
    // Mock retorna null (localStorage vazio)
    (storage.getViewHistory as jest.Mock).mockReturnValue([]);

    const { result } = renderHook(() => useViewHistory(mockTools));

    // waitFor() espera o useEffect completar
    // (useEffect é assíncrono)
    await waitFor(() => {
      expect(result.current.recentTools).toHaveLength(0);
    });
  });

  // ========== TESTE 2: Carrega Histórico Existente ==========
  // localStorage tem ["app-0", "app-1", "app-2"]
  // recentTools = [Tool0, Tool1, Tool2]?
  it('should load history from localStorage on mount', async () => {
    // Mock retorna IDs que existem
    (storage.getViewHistory as jest.Mock).mockReturnValue([
      'app-0',
      'app-1',
      'app-2',
    ]);

    const { result } = renderHook(() => useViewHistory(mockTools));

    await waitFor(() => {
      expect(result.current.recentTools).toHaveLength(3);
      expect(result.current.recentTools[0].app_id).toBe('app-0');
      expect(result.current.recentTools[1].app_id).toBe('app-1');
      expect(result.current.recentTools[2].app_id).toBe('app-2');
    });
  });

  // ========== TESTE 3: Adicionar Item Novo ==========
  // Chama addToHistory(app1)
  // Salva no localStorage?
  it('should add new item to history', async () => {
    (storage.getViewHistory as jest.Mock).mockReturnValue([]);

    const { result } = renderHook(() => useViewHistory(mockTools));

    await waitFor(() => {
      expect(result.current.recentTools).toHaveLength(0);
    });

    // Adiciona app-0
    act(() => {
      result.current.addToHistory(mockTools[0]);
    });

    // Verifica que storage.addToViewHistory foi chamado
    // com 'app-0'
    expect(storage.addToViewHistory).toHaveBeenCalledWith('app-0');
  });

  // ========== TESTE 4: Item Duplicado (Move pro Topo) ==========
  // Histórico: ["app-1", "app-0", "app-2"]
  // Adiciona app-0 de novo
  // Novo histórico: ["app-0", "app-1", "app-2"] (app-0 volta pro topo)
  it('should move duplicate item to the front', async () => {
    // Mock começa com 3 items
    (storage.getViewHistory as jest.Mock)
      .mockReturnValueOnce(['app-1', 'app-0', 'app-2']) // Primeira chamada (mount)
      .mockReturnValueOnce(['app-0', 'app-1', 'app-2']); // Segunda chamada (após add)

    const { result } = renderHook(() => useViewHistory(mockTools));

    // Espera carregar histórico inicial
    await waitFor(() => {
      expect(result.current.recentTools[1].app_id).toBe('app-0');
    });

    // Adiciona app-0 de novo (já está lá)
    act(() => {
      result.current.addToHistory(mockTools[0]);
    });

    // Verifica que foi salvo
    expect(storage.addToViewHistory).toHaveBeenCalledWith('app-0');
  });

  // ========== TESTE 5: Máximo 3 Items ==========
  // Histórico: ["app-0", "app-1", "app-2"] (cheio)
  // Adiciona app-3
  // Novo: ["app-3", "app-0", "app-1"] (app-2 foi removido)
  it('should maintain max 3 recent tools', async () => {
    (storage.getViewHistory as jest.Mock)
      .mockReturnValueOnce(['app-0', 'app-1', 'app-2']) // Mount
      .mockReturnValueOnce(['app-3', 'app-0', 'app-1']); // Após add

    const { result } = renderHook(() => useViewHistory(mockTools));

    await waitFor(() => {
      expect(result.current.recentTools).toHaveLength(3);
    });

    // Adiciona 4º item
    act(() => {
      result.current.addToHistory(mockTools[3]);
    });

    // Verifica que foi chamado com o novo item
    expect(storage.addToViewHistory).toHaveBeenCalledWith('app-3');
  });

  // ========== TESTE 6: Filtra IDs Inexistentes ==========
  // localStorage tem ["app-0", "app-999"] (999 não existe)
  // recentTools = [Tool0] (app-999 foi filtrado)
  it('should filter out non-existent tool IDs', async () => {
    // localStorage retorna um ID que não existe em mockTools
    (storage.getViewHistory as jest.Mock).mockReturnValue(['app-0', 'app-999']);

    const { result } = renderHook(() => useViewHistory(mockTools));

    await waitFor(() => {
      // Só app-0 existe, app-999 foi filtrado
      expect(result.current.recentTools).toHaveLength(1);
      expect(result.current.recentTools[0].app_id).toBe('app-0');
    });
  });

  // ========== TESTE 7: Preserva Ordem ==========
  // localStorage: ["app-5", "app-2", "app-7"]
  // recentTools mantém a mesma ordem?
  it('should preserve the order from localStorage', async () => {
    (storage.getViewHistory as jest.Mock).mockReturnValue([
      'app-5',
      'app-2',
      'app-7',
    ]);

    const { result } = renderHook(() => useViewHistory(mockTools));

    await waitFor(() => {
      expect(result.current.recentTools[0].app_id).toBe('app-5');
      expect(result.current.recentTools[1].app_id).toBe('app-2');
      expect(result.current.recentTools[2].app_id).toBe('app-7');
    });
  });
});
