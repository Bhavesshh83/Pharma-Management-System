import { useState, useCallback } from 'react';

interface RequestQueue {
  isProcessing: boolean;
  promises: Map<string, Promise<any>>;
}

const requestQueue: RequestQueue = {
  isProcessing: false,
  promises: new Map()
};

export function useDebouncedAuth() {
  const [isLoading, setIsLoading] = useState(false);

  const debouncedFetch = useCallback(async <T>(
    key: string,
    fetchFn: () => Promise<T>,
    delay: number = 100
  ): Promise<T> => {
    // If request already in progress, return existing promise
    if (requestQueue.promises.has(key)) {
      return requestQueue.promises.get(key);
    }

    const promise = new Promise<T>((resolve, reject) => {
      setTimeout(async () => {
        try {
          setIsLoading(true);
          const result = await fetchFn();
          resolve(result);
        } catch (error) {
          reject(error);
        } finally {
          setIsLoading(false);
          requestQueue.promises.delete(key);
        }
      }, delay);
    });

    requestQueue.promises.set(key, promise);
    return promise;
  }, []);

  return { debouncedFetch, isLoading };
}