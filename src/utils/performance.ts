// Performance monitoring utilities
export class PerformanceMonitor {
  private static marks = new Map<string, number>();
  private static measures = new Map<string, number>();

  static startMark(name: string): void {
    this.marks.set(name, performance.now());
    if ('mark' in performance) {
      performance.mark(`${name}-start`);
    }
  }

  static endMark(name: string): number {
    const startTime = this.marks.get(name);
    if (!startTime) {
      console.warn(`No start mark found for: ${name}`);
      return 0;
    }

    const endTime = performance.now();
    const duration = endTime - startTime;
    this.measures.set(name, duration);

    if ('mark' in performance && 'measure' in performance) {
      performance.mark(`${name}-end`);
      performance.measure(name, `${name}-start`, `${name}-end`);
    }

    this.marks.delete(name);
    console.log(`⏱️ ${name}: ${duration.toFixed(2)}ms`);
    return duration;
  }

  static getMeasure(name: string): number | undefined {
    return this.measures.get(name);
  }

  static getAllMeasures(): Record<string, number> {
    return Object.fromEntries(this.measures);
  }

  static clearMeasures(): void {
    this.measures.clear();
    this.marks.clear();
    if ('clearMarks' in performance && 'clearMeasures' in performance) {
      performance.clearMarks();
      performance.clearMeasures();
    }
  }
}

// Debounce utility for search and API calls
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number,
  immediate?: boolean
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null;
  
  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      timeout = null;
      if (!immediate) func(...args);
    };
    
    const callNow = immediate && !timeout;
    
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    
    if (callNow) func(...args);
  };
}

// Throttle utility for scroll events
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean;
  
  return function executedFunction(...args: Parameters<T>) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}

// Bundle size analyzer
export const analyzeBundle = () => {
  if (process.env.NODE_ENV === 'development') {
    const entries = performance.getEntriesByType('navigation') as PerformanceNavigationTiming[];
    const navigation = entries[0];
    
    console.group('📊 Performance Analysis');
    console.log('DOM Content Loaded:', `${navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart}ms`);
    console.log('Load Complete:', `${navigation.loadEventEnd - navigation.loadEventStart}ms`);
    console.log('First Paint:', navigation.responseEnd - navigation.requestStart);
    console.groupEnd();
  }
};

// Memory usage tracker
export const trackMemoryUsage = () => {
  if ('memory' in performance) {
    const memory = (performance as any).memory;
    console.log('Memory Usage:', {
      used: `${(memory.usedJSHeapSize / 1024 / 1024).toFixed(2)} MB`,
      total: `${(memory.totalJSHeapSize / 1024 / 1024).toFixed(2)} MB`,
      limit: `${(memory.jsHeapSizeLimit / 1024 / 1024).toFixed(2)} MB`
    });
  }
};

// Image optimization utility
export const optimizeImageLoading = (imageUrl: string, width?: number, quality = 80) => {
  // If using a CDN like Cloudinary or similar, add optimization parameters
  if (imageUrl.includes('cloudinary.com')) {
    const params = [
      width ? `w_${width}` : '',
      `q_${quality}`,
      'f_auto',
      'dpr_auto'
    ].filter(Boolean).join(',');
    
    return imageUrl.replace('/upload/', `/upload/${params}/`);
  }
  
  return imageUrl;
};