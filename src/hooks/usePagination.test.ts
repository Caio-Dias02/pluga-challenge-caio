import { renderHook, act } from '@testing-library/react';
import { usePagination } from './usePagination';
import type { Tool } from '../types';

// ============================================
// DADOS MOCK (fake)
// ============================================
// Criamos ferramentas falsas para testar
// Exemplo: em vez de carregar 200 apps reais,
// criamos um array de 50 items fake

const createMockTools = (count: number): Tool[] => {
  return Array.from({ length: count }, (_, i) => ({
    app_id: `app-${i}`,
    name: `App ${i}`,
    icon: `https://example.com/icon-${i}.png`,
    color: '#000000',
    link: `https://example.com/app-${i}`,
  }));
};

// ============================================
// TESTES COMEÇAM AQUI
// ============================================
describe('usePagination', () => {
  // ========== TESTE 1: Estado Inicial ==========
  // O hook começa na página 1 com dados corretos?
  it('should initialize with page 1 and correct total pages', () => {
    const mockTools = createMockTools(50);
    const itemsPerPage = 12;

    // renderHook() simula o hook rodando
    // Diferente de renderizar um componente, renderiza só o hook
    const { result } = renderHook(() => usePagination(mockTools, itemsPerPage));

    // result.current = valor de retorno do hook
    expect(result.current.currentPage).toBe(1);
    expect(result.current.totalPages).toBe(5); // 50 / 12 = 4.16... arredonda pra 5
    expect(result.current.currentItems).toHaveLength(12); // Primeira página tem 12 items
  });

  // ========== TESTE 2: Navegar para Página Específica ==========
  // Consigo ir pra página 3?
  it('should navigate to a specific page with correct items', () => {
    const mockTools = createMockTools(50);
    const { result } = renderHook(() => usePagination(mockTools, 12));

    // act() envolve mudanças de estado
    // Sem act() o React reclama (warning)
    act(() => {
      result.current.goToPage(3);
    });

    expect(result.current.currentPage).toBe(3);
    // Página 3: items 25-36 (0-indexed: [24:36])
    expect(result.current.currentItems).toHaveLength(12);
    expect(result.current.currentItems[0].app_id).toBe('app-24');
  });

  // ========== TESTE 3: Limite Superior (Valor Muito Alto) ==========
  // Se eu pedir página 999, fica na última?
  it('should clamp page to max (protection against going too far)', () => {
    const mockTools = createMockTools(50);
    const { result } = renderHook(() => usePagination(mockTools, 12));

    act(() => {
      result.current.goToPage(999);
    });

    // Deve ficar na última página (5)
    expect(result.current.currentPage).toBe(5);
  });

  // ========== TESTE 4: Limite Inferior (Valor Negativo) ==========
  // Se eu pedir página -5, volta pra 1?
  it('should clamp page to min (protection against negative)', () => {
    const mockTools = createMockTools(50);
    const { result } = renderHook(() => usePagination(mockTools, 12));

    act(() => {
      result.current.goToPage(-5);
    });

    expect(result.current.currentPage).toBe(1);
  });

  // ========== TESTE 5: Próxima Página ==========
  // nextPage() avança uma página?
  it('should move to next page', () => {
    const mockTools = createMockTools(50);
    const { result } = renderHook(() => usePagination(mockTools, 12));

    // Começa em página 1
    expect(result.current.currentPage).toBe(1);

    act(() => {
      result.current.nextPage();
    });

    // Vai pra página 2
    expect(result.current.currentPage).toBe(2);
  });

  // ========== TESTE 6: Próxima Página na Última ==========
  // Se já tá na última página, nextPage() não sai?
  it('should not exceed max page with nextPage', () => {
    const mockTools = createMockTools(50);
    const { result } = renderHook(() => usePagination(mockTools, 12));

    // Vai pra última página (5)
    act(() => {
      result.current.goToPage(5);
    });

    // Tenta ir pra próxima
    act(() => {
      result.current.nextPage();
    });

    // Continua em 5
    expect(result.current.currentPage).toBe(5);
  });

  // ========== TESTE 7: Página Anterior ==========
  // prevPage() volta uma página?
  it('should move to previous page', () => {
    const mockTools = createMockTools(50);
    const { result } = renderHook(() => usePagination(mockTools, 12));

    // Vai pra página 3
    act(() => {
      result.current.goToPage(3);
    });

    // Volta pra página 2
    act(() => {
      result.current.prevPage();
    });

    expect(result.current.currentPage).toBe(2);
  });

  // ========== TESTE 8: Página Anterior na Primeira ==========
  // Se já tá na primeira, prevPage() não sai?
  it('should not go below page 1 with prevPage', () => {
    const mockTools = createMockTools(50);
    const { result } = renderHook(() => usePagination(mockTools, 12));

    // Começa em página 1
    expect(result.current.currentPage).toBe(1);

    // Tenta voltar
    act(() => {
      result.current.prevPage();
    });

    // Continua em 1
    expect(result.current.currentPage).toBe(1);
  });

  // ========== TESTE 9: Lista Vazia ==========
  // Se não há items, funciona?
  it('should handle empty array', () => {
    const mockTools: Tool[] = [];
    const { result } = renderHook(() => usePagination(mockTools, 12));

    expect(result.current.currentPage).toBe(1);
    expect(result.current.totalPages).toBe(0);
    expect(result.current.currentItems).toHaveLength(0);
  });

  // ========== TESTE 10: Última Página Incompleta ==========
  // A última página com menos items (50 % 12 = 2)?
  it('should handle last page with fewer items', () => {
    const mockTools = createMockTools(50); // 50 / 12 = 4 completas + 1 com 2 items
    const { result } = renderHook(() => usePagination(mockTools, 12));

    act(() => {
      result.current.goToPage(5); // Última página
    });

    // Última página tem só 2 items (50 - 48)
    expect(result.current.currentItems).toHaveLength(2);
    expect(result.current.currentItems[0].app_id).toBe('app-48');
    expect(result.current.currentItems[1].app_id).toBe('app-49');
  });
});
