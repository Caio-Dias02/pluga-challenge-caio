import { renderHook, act } from '@testing-library/react';
import { usePagination } from './usePagination';
import type { Tool } from '../types';

// Mock data generator
const createMockTools = (count: number): Tool[] => {
  return Array.from({ length: count }, (_, i) => ({
    app_id: `app-${i}`,
    name: `App ${i}`,
    icon: `https://example.com/icon-${i}.png`,
    color: '#000000',
    link: `https://example.com/app-${i}`,
  }));
};

describe('usePagination', () => {
  it('should initialize with page 1 and correct total pages', () => {
    const mockTools = createMockTools(50);
    const itemsPerPage = 12;

    const { result } = renderHook(() => usePagination(mockTools, itemsPerPage));

    expect(result.current.currentPage).toBe(1);
    expect(result.current.totalPages).toBe(5);
    expect(result.current.currentItems).toHaveLength(12);
  });

  it('should navigate to a specific page with correct items', () => {
    const mockTools = createMockTools(50);
    const { result } = renderHook(() => usePagination(mockTools, 12));

    act(() => {
      result.current.goToPage(3);
    });

    expect(result.current.currentPage).toBe(3);
    expect(result.current.currentItems).toHaveLength(12);
    expect(result.current.currentItems[0].app_id).toBe('app-24');
  });

  it('should clamp page to max (protection against going too far)', () => {
    const mockTools = createMockTools(50);
    const { result } = renderHook(() => usePagination(mockTools, 12));

    act(() => {
      result.current.goToPage(999);
    });

    expect(result.current.currentPage).toBe(5);
  });

  it('should clamp page to min (protection against negative)', () => {
    const mockTools = createMockTools(50);
    const { result } = renderHook(() => usePagination(mockTools, 12));

    act(() => {
      result.current.goToPage(-5);
    });

    expect(result.current.currentPage).toBe(1);
  });

  it('should move to next page', () => {
    const mockTools = createMockTools(50);
    const { result } = renderHook(() => usePagination(mockTools, 12));

    expect(result.current.currentPage).toBe(1);

    act(() => {
      result.current.nextPage();
    });

    expect(result.current.currentPage).toBe(2);
  });

  it('should not exceed max page with nextPage', () => {
    const mockTools = createMockTools(50);
    const { result } = renderHook(() => usePagination(mockTools, 12));

    act(() => {
      result.current.goToPage(5);
    });

    act(() => {
      result.current.nextPage();
    });

    expect(result.current.currentPage).toBe(5);
  });

  it('should move to previous page', () => {
    const mockTools = createMockTools(50);
    const { result } = renderHook(() => usePagination(mockTools, 12));

    act(() => {
      result.current.goToPage(3);
    });

    act(() => {
      result.current.prevPage();
    });

    expect(result.current.currentPage).toBe(2);
  });

  it('should not go below page 1 with prevPage', () => {
    const mockTools = createMockTools(50);
    const { result } = renderHook(() => usePagination(mockTools, 12));

    expect(result.current.currentPage).toBe(1);

    act(() => {
      result.current.prevPage();
    });

    expect(result.current.currentPage).toBe(1);
  });

  it('should handle empty array', () => {
    const mockTools: Tool[] = [];
    const { result } = renderHook(() => usePagination(mockTools, 12));

    expect(result.current.currentPage).toBe(1);
    expect(result.current.totalPages).toBe(0);
    expect(result.current.currentItems).toHaveLength(0);
  });

  it('should handle last page with fewer items', () => {
    const mockTools = createMockTools(50);
    const { result } = renderHook(() => usePagination(mockTools, 12));

    act(() => {
      result.current.goToPage(5);
    });

    expect(result.current.currentItems).toHaveLength(2);
    expect(result.current.currentItems[0].app_id).toBe('app-48');
    expect(result.current.currentItems[1].app_id).toBe('app-49');
  });
});
