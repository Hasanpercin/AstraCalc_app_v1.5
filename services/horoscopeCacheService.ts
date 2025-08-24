/**
 * Daily Horoscope Cache Service
 * Implements intelligent caching to reduce unnecessary API calls and improve performance
 */

import AsyncStorage from '@react-native-async-storage/async-storage';

interface CachedHoroscope {
  comment: string;
  horoscope_date: string;
  user_id: string;
  cached_at: string;
  expires_at: string;
}

interface CacheResult {
  data: CachedHoroscope | null;
  isExpired: boolean;
  error?: string;
}

export class HoroscopeCacheService {
  private static readonly CACHE_PREFIX = 'horoscope_cache_';
  private static readonly CACHE_EXPIRY_HOURS = 24; // Cache expires after 24 hours
  
  /**
   * Generate cache key for user's daily horoscope
   */
  private static getCacheKey(userId: string, date: string): string {
    return `${this.CACHE_PREFIX}${userId}_${date}`;
  }
  
  /**
   * Get cached horoscope for specific user and date
   */
  static async getCachedHoroscope(userId: string, date?: string): Promise<CacheResult> {
    try {
      const targetDate = date || new Date().toISOString().split('T')[0];
      const cacheKey = this.getCacheKey(userId, targetDate);
      
      const cachedData = await AsyncStorage.getItem(cacheKey);
      
      if (!cachedData) {
        return { data: null, isExpired: true };
      }
      
      const parsed: CachedHoroscope = JSON.parse(cachedData);
      const now = new Date();
      const expiresAt = new Date(parsed.expires_at);
      
      const isExpired = now > expiresAt;
      
      console.log(`📦 Cache ${isExpired ? 'EXPIRED' : 'HIT'} for user ${userId} on ${targetDate}`);
      
      return {
        data: parsed,
        isExpired
      };
      
    } catch (error) {
      console.error('Cache retrieval error:', error);
      return {
        data: null,
        isExpired: true,
        error: error instanceof Error ? error.message : 'Cache error'
      };
    }
  }
  
  /**
   * Cache horoscope data for user
   */
  static async cacheHoroscope(
    userId: string,
    comment: string,
    horoscope_date: string
  ): Promise<{ success: boolean; error?: string }> {
    try {
      const now = new Date();
      const expiresAt = new Date(now.getTime() + (this.CACHE_EXPIRY_HOURS * 60 * 60 * 1000));
      
      const cacheData: CachedHoroscope = {
        comment,
        horoscope_date,
        user_id: userId,
        cached_at: now.toISOString(),
        expires_at: expiresAt.toISOString()
      };
      
      const cacheKey = this.getCacheKey(userId, horoscope_date);
      await AsyncStorage.setItem(cacheKey, JSON.stringify(cacheData));
      
      console.log(`💾 Horoscope cached for user ${userId} until ${expiresAt.toLocaleString()}`);
      
      return { success: true };
      
    } catch (error) {
      console.error('Cache storage error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Cache error'
      };
    }
  }
  
  /**
   * Clear expired cache entries
   */
  static async clearExpiredCache(): Promise<{ success: boolean; clearedCount: number; error?: string }> {
    try {
      const allKeys = await AsyncStorage.getAllKeys();
      const horoscopeKeys = allKeys.filter(key => key.startsWith(this.CACHE_PREFIX));
      
      let clearedCount = 0;
      const now = new Date();
      
      for (const key of horoscopeKeys) {
        try {
          const cachedData = await AsyncStorage.getItem(key);
          if (!cachedData) continue;
          
          const parsed: CachedHoroscope = JSON.parse(cachedData);
          const expiresAt = new Date(parsed.expires_at);
          
          if (now > expiresAt) {
            await AsyncStorage.removeItem(key);
            clearedCount++;
          }
        } catch (e) {
          // Remove invalid cache entries
          await AsyncStorage.removeItem(key);
          clearedCount++;
        }
      }
      
      console.log(`🧹 Cleared ${clearedCount} expired cache entries`);
      
      return { success: true, clearedCount };
      
    } catch (error) {
      console.error('Cache cleanup error:', error);
      return {
        success: false,
        clearedCount: 0,
        error: error instanceof Error ? error.message : 'Cleanup error'
      };
    }
  }
  
  /**
   * Clear all cached horoscopes for a specific user
   */
  static async clearUserCache(userId: string): Promise<{ success: boolean; error?: string }> {
    try {
      const allKeys = await AsyncStorage.getAllKeys();
      const userKeys = allKeys.filter(key => 
        key.startsWith(this.CACHE_PREFIX) && key.includes(userId)
      );
      
      await AsyncStorage.multiRemove(userKeys);
      
      console.log(`🗑️ Cleared ${userKeys.length} cache entries for user ${userId}`);
      
      return { success: true };
      
    } catch (error) {
      console.error('User cache clear error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Clear error'
      };
    }
  }
  
  /**
   * Get cache statistics
   */
  static async getCacheStats(): Promise<{
    totalEntries: number;
    expiredEntries: number;
    validEntries: number;
    totalSizeKB: number;
  }> {
    try {
      const allKeys = await AsyncStorage.getAllKeys();
      const horoscopeKeys = allKeys.filter(key => key.startsWith(this.CACHE_PREFIX));
      
      let expiredCount = 0;
      let totalSize = 0;
      const now = new Date();
      
      for (const key of horoscopeKeys) {
        try {
          const cachedData = await AsyncStorage.getItem(key);
          if (!cachedData) continue;
          
          totalSize += cachedData.length;
          
          const parsed: CachedHoroscope = JSON.parse(cachedData);
          const expiresAt = new Date(parsed.expires_at);
          
          if (now > expiresAt) {
            expiredCount++;
          }
        } catch (e) {
          expiredCount++;
        }
      }
      
      return {
        totalEntries: horoscopeKeys.length,
        expiredEntries: expiredCount,
        validEntries: horoscopeKeys.length - expiredCount,
        totalSizeKB: Math.round(totalSize / 1024)
      };
      
    } catch (error) {
      console.error('Cache stats error:', error);
      return {
        totalEntries: 0,
        expiredEntries: 0,
        validEntries: 0,
        totalSizeKB: 0
      };
    }
  }
}