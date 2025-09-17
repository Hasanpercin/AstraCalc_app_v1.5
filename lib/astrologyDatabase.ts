import { supabase } from './supabase';
import { Database } from '../types/database';

// Advanced PostgreSQL queries for AstroCalc
export class AstrologyDatabase {
  private supabase;

  constructor() {
    this.supabase = supabase;
  }

  // Optimized birth chart data queries
  async getUserBirthChartData(userId: string) {
    if (!this.supabase) throw new Error('Supabase not configured');
    
    const { data, error } = await this.supabase
      .from('user_profiles')
      .select(`
        id,
        birth_date,
        birth_time,
        birth_location,
        timezone,
        birth_chart_data,
        created_at,
        updated_at
      `)
      .eq('id', userId)
      .single();

    if (error) throw error;
    return data;
  }

  // Advanced horoscope caching with PostgreSQL JSON operations
  async getCachedHoroscope(userId: string, date: string) {
    if (!this.supabase) throw new Error('Supabase not configured');
    
    const { data, error } = await this.supabase
      .from('horoscope_cache')
      .select('*')
      .eq('user_id', userId)
      .eq('date', date)
      .gte('expires_at', new Date().toISOString())
      .single();

    if (error && error.code !== 'PGRST116') throw error;
    return data;
  }

  // Bulk insert horoscopes with conflict resolution
  async upsertHoroscopes(horoscopes: Array<{
    user_id: string;
    date: string;
    content: any;
    expires_at: string;
  }>) {
    if (!this.supabase) throw new Error('Supabase not configured');
    
    const { data, error } = await this.supabase
      .from('horoscope_cache')
      .upsert(horoscopes, {
        onConflict: 'user_id,date',
        ignoreDuplicates: false
      });

    if (error) throw error;
    return data;
  }

  // Advanced analytics queries
  async getUserEngagementStats(userId: string) {
    if (!this.supabase) throw new Error('Supabase not configured');
    
    const { data, error } = await this.supabase.rpc('get_user_engagement', {
      p_user_id: userId
    });

    if (error) throw error;
    return data;
  }

  // Optimized chat message storage with full-text search
  async searchChatMessages(userId: string, query: string) {
    if (!this.supabase) throw new Error('Supabase not configured');
    
    const { data, error } = await this.supabase
      .from('chat_messages')
      .select('*')
      .eq('user_id', userId)
      .textSearch('content', query)
      .order('created_at', { ascending: false })
      .limit(20);

    if (error) throw error;
    return data;
  }

  // Batch operations for performance
  async batchUpdateUserProfiles(updates: Array<{
    id: string;
    birth_chart_data?: any;
    preferences?: any;
  }>) {
    if (!this.supabase) throw new Error('Supabase not configured');
    
    const { data, error } = await this.supabase
      .from('user_profiles')
      .upsert(updates, { onConflict: 'id' });

    if (error) throw error;
    return data;
  }

  // Advanced birth chart compatibility queries
  async findCompatibleUsers(userId: string, limit: number = 10) {
    if (!this.supabase) throw new Error('Supabase not configured');
    
    const { data, error } = await this.supabase.rpc('find_compatible_charts', {
      p_user_id: userId,
      p_limit: limit
    });

    if (error) throw error;
    return data;
  }

  // Database health check
  async healthCheck() {
    if (!this.supabase) return { healthy: false, error: 'Supabase not configured' };
    
    try {
      const { data, error } = await this.supabase
        .from('user_profiles')
        .select('count(*)', { count: 'exact', head: true });
      
      return { healthy: !error, count: data };
    } catch (error) {
      return { healthy: false, error };
    }
  }

  // Performance monitoring query
  async getQueryPerformanceStats() {
    if (!this.supabase) throw new Error('Supabase not configured');
    
    const { data, error } = await this.supabase.rpc('get_performance_stats');
    if (error) throw error;
    return data;
  }
}

export const astrologyDB = new AstrologyDatabase();
