import { supabase } from '@/integrations/supabase/client';
import { globalCache } from '@/hooks/useOptimizedFetch';

// Batch API request queue
class BatchRequestQueue {
  private queue: Array<{
    key: string;
    request: () => Promise<any>;
    resolve: (value: any) => void;
    reject: (error: any) => void;
  }> = [];
  private processing = false;
  private readonly BATCH_SIZE = 5;
  private readonly DELAY = 100; // ms

  add<T>(key: string, request: () => Promise<T>): Promise<T> {
    return new Promise((resolve, reject) => {
      this.queue.push({ key, request, resolve, reject });
      this.process();
    });
  }

  private async process() {
    if (this.processing || this.queue.length === 0) return;
    
    this.processing = true;
    
    while (this.queue.length > 0) {
      const batch = this.queue.splice(0, this.BATCH_SIZE);
      
      // Execute batch requests in parallel
      const promises = batch.map(async ({ key, request, resolve, reject }) => {
        try {
          const result = await request();
          resolve(result);
        } catch (error) {
          reject(error);
        }
      });

      await Promise.allSettled(promises);
      
      // Small delay between batches to prevent rate limiting
      if (this.queue.length > 0) {
        await new Promise(resolve => setTimeout(resolve, this.DELAY));
      }
    }
    
    this.processing = false;
  }
}

export const batchQueue = new BatchRequestQueue();

// Optimized medicine search with caching
export const searchMedicinesOptimized = async (query: string, category?: string) => {
  const cacheKey = `medicines_${query}_${category || 'all'}`;
  
  // Check cache first
  if (globalCache.has(cacheKey)) {
    return globalCache.get(cacheKey);
  }

  return batchQueue.add(cacheKey, async () => {
    let queryBuilder = supabase
      .from('medicines')
      .select('*')
      .eq('in_stock', true);

    if (query) {
      queryBuilder = queryBuilder.ilike('name', `%${query}%`);
    }

    if (category) {
      queryBuilder = queryBuilder.eq('category', category);
    }

    const { data, error } = await queryBuilder.limit(50);
    
    if (error) throw error;
    
    // Cache for 10 minutes
    globalCache.set(cacheKey, data, 10 * 60 * 1000);
    return data;
  });
};

// Optimized RxNorm API with caching and rate limiting
export const searchRxNormOptimized = async (drugName: string) => {
  const cacheKey = `rxnorm_${drugName.toLowerCase()}`;
  
  if (globalCache.has(cacheKey)) {
    return globalCache.get(cacheKey);
  }

  return batchQueue.add(cacheKey, async () => {
    try {
      const cleanedName = drugName.replace(/[^\w\s]/g, '').trim();
      const response = await fetch(
        `https://rxnav.nlm.nih.gov/REST/drugs.json?name=${encodeURIComponent(cleanedName)}`,
        {
          headers: {
            'Accept': 'application/json',
          },
        }
      );

      if (!response.ok) {
        throw new Error(`RxNorm API error: ${response.status}`);
      }

      const data = await response.json();
      
      // Cache for 24 hours
      globalCache.set(cacheKey, data, 24 * 60 * 60 * 1000);
      return data;
    } catch (error) {
      console.error('RxNorm API error:', error);
      return null;
    }
  });
};

// Optimized prescription processing
export const processPrescriptionOptimized = async (
  imageFile: File,
  userId: string
) => {
  const formData = new FormData();
  formData.append('image', imageFile);
  formData.append('userId', userId);

  // Use edge function for OCR processing to offload computation
  const { data, error } = await supabase.functions.invoke('process-prescription', {
    body: formData,
  });

  if (error) throw error;
  return data;
};

// Database query optimizations
export const getMedicinesWithPagination = async (
  page: number = 1,
  limit: number = 20,
  category?: string
) => {
  const offset = (page - 1) * limit;
  const cacheKey = `medicines_page_${page}_${limit}_${category || 'all'}`;

  if (globalCache.has(cacheKey)) {
    return globalCache.get(cacheKey);
  }

  let query = supabase
    .from('medicines')
    .select('*', { count: 'exact' })
    .eq('in_stock', true)
    .range(offset, offset + limit - 1);

  if (category) {
    query = query.eq('category', category);
  }

  const { data, error, count } = await query;
  
  if (error) throw error;

  const result = {
    data,
    totalCount: count,
    currentPage: page,
    totalPages: Math.ceil((count || 0) / limit),
    hasNextPage: page * limit < (count || 0),
    hasPreviousPage: page > 1
  };

  // Cache for 5 minutes
  globalCache.set(cacheKey, result, 5 * 60 * 1000);
  return result;
};