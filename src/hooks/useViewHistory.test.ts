import { renderHook, act, waitFor } from '@testing-library/react';
import { useViewHistory } from './useViewHistory';
import * as storage from '../services/storage';
import type { Tool } from '../types';

jest.mock('../services/storage');

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

  beforeEach(() => {
    jest.clearAllMocks();
    (storage.getViewHistory as jest.Mock).mockReset();
    (storage.addToViewHistory as jest.Mock).mockReset();
  });

  it('should return empty array when localStorage is empty', async () => {
    (storage.getViewHistory as jest.Mock).mockReturnValue([]);
    const { result } = renderHook(() => useViewHistory(mockTools));

    await waitFor(() => {
      expect(result.current.recentTools).toHaveLength(0);
    });
  });

  it('should load history from localStorage on mount', async () => {
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

  it('should add new item to history', async () => {
    (storage.getViewHistory as jest.Mock).mockReturnValue([]);
    const { result } = renderHook(() => useViewHistory(mockTools));

    await waitFor(() => {
      expect(result.current.recentTools).toHaveLength(0);
    });

    act(() => {
      result.current.addToHistory(mockTools[0]);
    });

    expect(storage.addToViewHistory).toHaveBeenCalledWith('app-0');
  });

  it('should move duplicate item to the front', async () => {
    (storage.getViewHistory as jest.Mock)
      .mockReturnValueOnce(['app-1', 'app-0', 'app-2'])
      .mockReturnValueOnce(['app-0', 'app-1', 'app-2']);

    const { result } = renderHook(() => useViewHistory(mockTools));

    await waitFor(() => {
      expect(result.current.recentTools[1].app_id).toBe('app-0');
    });

    act(() => {
      result.current.addToHistory(mockTools[0]);
    });

    expect(storage.addToViewHistory).toHaveBeenCalledWith('app-0');
  });

  it('should maintain max 3 recent tools', async () => {
    (storage.getViewHistory as jest.Mock)
      .mockReturnValueOnce(['app-0', 'app-1', 'app-2'])
      .mockReturnValueOnce(['app-3', 'app-0', 'app-1']);

    const { result } = renderHook(() => useViewHistory(mockTools));

    await waitFor(() => {
      expect(result.current.recentTools).toHaveLength(3);
    });

    act(() => {
      result.current.addToHistory(mockTools[3]);
    });

    expect(storage.addToViewHistory).toHaveBeenCalledWith('app-3');
  });

  it('should filter out non-existent tool IDs', async () => {
    (storage.getViewHistory as jest.Mock).mockReturnValue(['app-0', 'app-999']);
    const { result } = renderHook(() => useViewHistory(mockTools));

    await waitFor(() => {
      expect(result.current.recentTools).toHaveLength(1);
      expect(result.current.recentTools[0].app_id).toBe('app-0');
    });
  });

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
