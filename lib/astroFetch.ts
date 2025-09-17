// Advanced Fetch utilities for AstroCalc
interface FetchConfig {
  baseURL?: string | undefined;
  timeout?: number | undefined;
  retries?: number | undefined;
  retryDelay?: number | undefined;
  headers?: Record<string, string> | undefined;
}

interface ApiResponse<T = any> {
  data: T;
  status: number;
  success: boolean;
  error?: string;
  timestamp: string;
}

interface AstroRequestOptions {
  timeout?: number | undefined;
  retries?: number | undefined;
  useCache?: boolean | undefined;
  cacheTime?: number | undefined;
}

type AstroRequestInit = RequestInit & AstroRequestOptions;

export class AstroCalcFetch {
  private config: FetchConfig;
  private cache: Map<string, { data: any; expires: number }> = new Map();

  constructor(config: FetchConfig = {}) {
    this.config = {
      timeout: 30000,
      retries: 3,
      retryDelay: 1000,
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'AstroCalc/1.0.0',
      },
      ...config,
    };
  }

  // Enhanced fetch with retry logic
  async request<T = any>(
    url: string,
    options: RequestInit & { 
      timeout?: number; 
      retries?: number;
      cache?: boolean;
      cacheTime?: number;
    } = {}
  ): Promise<ApiResponse<T>> {
    const fullUrl = this.config.baseURL ? `${this.config.baseURL}${url}` : url;
    const cacheKey = `${options.method || 'GET'}:${fullUrl}`;
    
    // Check cache first
    if (options.cache !== false) {
      const cached = this.cache.get(cacheKey);
      if (cached && cached.expires > Date.now()) {
        return cached.data;
      }
    }

    const timeout = options.timeout || this.config.timeout!;
    const retries = options.retries || this.config.retries!;
    
    let lastError: Error;

    for (let attempt = 0; attempt <= retries; attempt++) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), timeout);

        const response = await fetch(fullUrl, {
          ...options,
          signal: controller.signal,
          headers: {
            ...this.config.headers,
            ...options.headers,
          },
        });

        clearTimeout(timeoutId);

        const responseData = await response.json();
        const result: ApiResponse<T> = {
          data: responseData,
          status: response.status,
          success: response.ok,
          timestamp: new Date().toISOString(),
        };

        if (!response.ok) {
          result.error = responseData.message || `HTTP ${response.status}`;
        }

        // Cache successful responses
        if (response.ok && options.cache !== false) {
          const cacheTime = options.cacheTime || 300000; // 5 minutes default
          this.cache.set(cacheKey, {
            data: result,
            expires: Date.now() + cacheTime,
          });
        }

        return result;

      } catch (error) {
        lastError = error as Error;
        
        // Don't retry on the last attempt
        if (attempt < retries) {
          await this.delay(this.config.retryDelay! * Math.pow(2, attempt));
        }
      }
    }

    return {
      data: null as T,
      status: 0,
      success: false,
      error: lastError!.message,
      timestamp: new Date().toISOString(),
    };
  }

  // Astrology-specific API calls
  async sendAIWebhook(payload: {
    userId: string;
    question: string;
    full_name: string;
    timestamp: string;
    today: string;
    source: string;
  }) {
    const webhookUrl = process.env.EXPO_PUBLIC_WEBHOOK_URL;
    const webhookToken = process.env.EXPO_PUBLIC_WEBHOOK_TOKEN;

    if (!webhookUrl) {
      throw new Error('Webhook URL not configured');
    }

    return this.request(webhookUrl, {
      method: 'POST',
      headers: {
        'Authorization': webhookToken ? `Bearer ${webhookToken}` : undefined,
        'X-Source': 'astrocalc-mobile',
      },
      body: JSON.stringify(payload),
      timeout: 45000, // AI responses can be slow
      retries: 2,
      cache: false,
    });
  }

  // Fetch astronomical data
  async getAstronomicalData(date: string, lat: number, lng: number) {
    return this.request('/api/astronomical-data', {
      method: 'GET',
      headers: {
        'X-Date': date,
        'X-Latitude': lat.toString(),
        'X-Longitude': lng.toString(),
      },
      cache: true,
      cacheTime: 3600000, // 1 hour cache for astronomical data
    });
  }

  // Batch API calls
  async batchRequest<T = any>(requests: Array<{
    url: string;
    options?: RequestInit;
  }>): Promise<Array<ApiResponse<T>>> {
    const promises = requests.map(({ url, options }) => 
      this.request<T>(url, options)
    );
    
    return Promise.all(promises);
  }

  // Network connectivity check
  async checkConnectivity(): Promise<boolean> {
    try {
      const response = await this.request('/health', {
        timeout: 5000,
        retries: 1,
        cache: false,
      });
      return response.success;
    } catch {
      return false;
    }
  }

  // Clear cache
  clearCache(pattern?: string) {
    if (pattern) {
      for (const key of this.cache.keys()) {
        if (key.includes(pattern)) {
          this.cache.delete(key);
        }
      }
    } else {
      this.cache.clear();
    }
  }

  // Get cache stats
  getCacheStats() {
    return {
      size: this.cache.size,
      keys: Array.from(this.cache.keys()),
    };
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

// Singleton instance for AstroCalc
export const astroFetch = new AstroCalcFetch({
  baseURL: process.env.EXPO_PUBLIC_API_BASE_URL,
  timeout: 30000,
  retries: 3,
});

// Convenience functions
export const aiWebhook = (payload: any) => astroFetch.sendAIWebhook(payload);
export const getAstroData = (date: string, lat: number, lng: number) => 
  astroFetch.getAstronomicalData(date, lat, lng);
export const checkNetworkHealth = () => astroFetch.checkConnectivity();
