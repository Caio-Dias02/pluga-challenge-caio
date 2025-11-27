import { renderHook, waitFor } from '@testing-library/react';
import { useToolsData } from './useToolsData';
import type { Tool } from '../types';

globalThis.fetch = jest.fn();

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
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should fetch tools successfully', async () => {
    (fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => mockTools,
    });

    const { result } = renderHook(() => useToolsData());

    expect(result.current.loading).toBe(true);
    expect(result.current.tools).toEqual([]);
    expect(result.current.error).toBeNull();

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.tools).toEqual(mockTools);
    expect(result.current.error).toBeNull();
  });

  it('should handle network errors', async () => {
    const networkError = new Error('Network error');
    (fetch as jest.Mock).mockRejectedValue(networkError);

    const { result } = renderHook(() => useToolsData());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.error).toBeTruthy();
    expect(result.current.tools).toEqual([]);
  });

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

    expect(result.current.error).toBeTruthy();
    expect(result.current.tools).toEqual([]);
  });

  it('should have correct loading state transitions', async () => {
    (fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => mockTools,
    });

    const { result } = renderHook(() => useToolsData());

    expect(result.current.loading).toBe(true);

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.tools).toEqual(mockTools);
  });

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

    expect(result.current.error).toBeTruthy();
    expect(result.current.tools).toEqual([]);
  });

  it('should call fetch with correct URL', async () => {
    (fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => mockTools,
    });

    renderHook(() => useToolsData());

    await waitFor(() => {
      expect(fetch).toHaveBeenCalled();
    });

    expect(fetch).toHaveBeenCalledWith(
      'https://pluga.co/ferramentas_search.json'
    );
  });

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
