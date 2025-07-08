import { useState, useEffect, useCallback } from 'react';

interface CacheEntry<T> {
  data: T;
  timestamp: number;
  expiry: number;
}

class OptimizedCache {
  private cache = new Map<string, CacheEntry<any>>();
  private readonly DEFAULT_EXPIRY = 5 * 60 * 1000; // 5 minutes

  set<T>(key: string, data: T, customExpiry?: number): void {
    const expiry = customExpiry || this.DEFAULT_EXPIRY;
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      expiry
    });
  }

  get<T>(key: string): T | null {
    const entry = this.cache.get(key);
    if (!entry) return null;

    const now = Date.now();
    if (now - entry.timestamp > entry.expiry) {
      this.cache.delete(key);
      return null;
    }

    return entry.data;
  }

  clear(): void {
    this.cache.clear();
  }

  has(key: string): boolean {
    const entry = this.cache.get(key);
    if (!entry) return false;

    const now = Date.now();
    if (now - entry.timestamp > entry.expiry) {
      this.cache.delete(key);
      return false;
    }

    return true;
  }
}

export const globalCache = new OptimizedCache();

interface UseOptimizedFetchOptions {
  cacheKey?: string;
  cacheExpiry?: number;
  retryCount?: number;
  retryDelay?: number;
}

export function useOptimizedFetch<T>(
  fetchFn: () => Promise<T>,
  deps: any[] = [],
  options: UseOptimizedFetchOptions = {}
) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const {
    cacheKey,
    cacheExpiry,
    retryCount = 2,
    retryDelay = 1000
  } = options;

  const fetchWithRetry = useCallback(async (attempt = 0): Promise<T> => {
    try {
      return await fetchFn();
    } catch (err) {
      if (attempt < retryCount) {
        await new Promise(resolve => setTimeout(resolve, retryDelay * Math.pow(2, attempt)));
        return fetchWithRetry(attempt + 1);
      }
      throw err;
    }
  }, [fetchFn, retryCount, retryDelay]);

  const execute = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      // Check cache first
      if (cacheKey && globalCache.has(cacheKey)) {
        const cachedData = globalCache.get<T>(cacheKey);
        if (cachedData) {
          setData(cachedData);
          setLoading(false);
          return;
        }
      }

      const result = await fetchWithRetry();
      setData(result);

      // Cache the result
      if (cacheKey) {
        globalCache.set(cacheKey, result, cacheExpiry);
      }
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  }, [fetchWithRetry, cacheKey, cacheExpiry]);

  useEffect(() => {
    execute();
  }, deps);

  return { data, loading, error, refetch: execute };
}