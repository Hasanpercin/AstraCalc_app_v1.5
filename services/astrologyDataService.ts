import { supabase } from '@/lib/supabase';

export interface AstrologyInterpretationData {
  id: string;
  user_id: string;
  full_name?: string;
  sun_sign?: string;
  moon_sign?: string;
  rising_sign?: string;
  interpretation?: string;
  dogum_tarihi?: string;
  dogum_saati?: string;
  dogum_yeri?: string;
  dogum_tarihi?: string;
  dogum_saati?: string;
  dogum_yeri?: string;
  created_at: string;
  updated_at: string;
}

export interface AstrologyDataResult {
  data: AstrologyInterpretationData | null;
  error?: string;
}

export interface UserAstrologyDataResult {
  data: AstrologyInterpretationData[];
  error?: string;
}

/**
 * Secure Astrology Data Service
 * Handles user-specific astrology chart data retrieval with proper authentication
 */
export class AstrologyDataService {
  
  /**
   * Retrieve personalized astrology interpretation for authenticated user
   * @param userId - The authenticated user's UID
   * @returns User's astrology interpretation data or null if not found
   */
  static async getUserAstrologyInterpretation(userId: string): Promise<AstrologyDataResult> {
    try {
      // Validate input parameters
      if (!userId || typeof userId !== 'string') {
        return {
          data: null,
          error: 'Geçersiz kullanıcı kimliği'
        };
      }

      // Check if Supabase is configured
      if (!supabase) {
        console.warn('Supabase not configured - cannot retrieve astrology data');
        return {
          data: null,
          error: 'Veritabanı bağlantısı yapılandırılmamış'
        };
      }

      console.log('🔍 Retrieving astrology interpretation for user:', userId);

      // Query astrology_interpretations table with user-specific filter
      const { data, error } = await supabase
        .from('astrology_interpretations')
        .select(`
          id,
          user_id,
          full_name,
          sun_sign,
          moon_sign,
          rising_sign,
          interpretation,
          dogum_tarihi,
          dogum_saati,
          dogum_yeri,
          dogum_tarihi,
          dogum_saati,
          dogum_yeri,
          created_at,
          updated_at
        `)
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(1);

      // Handle database errors
      if (error) {
        console.error('❌ Database error retrieving astrology data:', error);
        
        // Handle specific error codes
        if (error.code === 'PGRST116') {
          // No rows found - this is not an error, just no data
          console.log('ℹ️ No astrology interpretation found for user:', userId);
          return { data: null };
        }
        
        if (error.message.includes('permission denied') || error.message.includes('row-level security')) {
          return {
            data: null,
            error: 'Bu verilere erişim yetkiniz bulunmuyor'
          };
        }
        
        return {
          data: null,
          error: `Veritabanı hatası: ${error.message}`
        };
      }

      // Return user's astrology data or null if no data found
      if (data && data.length > 0) {
        console.log('✅ Astrology interpretation retrieved successfully for user:', userId);
        return { data: data[0] };
      } else {
        console.log('ℹ️ No astrology interpretation found for user:', userId);
        return { data: null };
      }

    } catch (error) {
      console.error('💥 Unexpected error retrieving astrology data:', error);
      return {
        data: null,
        error: error instanceof Error ? error.message : 'Beklenmeyen hata oluştu'
      };
    }
  }

  /**
   * Get all astrology interpretations for a user (useful for history)
   * @param userId - The authenticated user's UID
   * @param limit - Maximum number of records to retrieve (default: 10)
   * @returns Array of user's astrology interpretations
   */
  static async getUserAstrologyHistory(userId: string, limit: number = 10): Promise<UserAstrologyDataResult> {
    try {
      if (!userId || typeof userId !== 'string') {
        return {
          data: [],
          error: 'Geçersiz kullanıcı kimliği'
        };
      }

      if (!supabase) {
        return {
          data: [],
          error: 'Veritabanı bağlantısı yapılandırılmamış'
        };
      }

      console.log('📚 Retrieving astrology history for user:', userId);

      const { data, error } = await supabase
        .from('astrology_interpretations')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(Math.max(1, Math.min(limit, 50))); // Enforce reasonable limits

      if (error) {
        console.error('❌ Error retrieving astrology history:', error);
        return {
          data: [],
          error: error.message
        };
      }

      console.log(`✅ Retrieved ${data?.length || 0} astrology records for user:`, userId);
      return { data: data || [] };

    } catch (error) {
      console.error('💥 Unexpected error retrieving astrology history:', error);
      return {
        data: [],
        error: error instanceof Error ? error.message : 'Beklenmeyen hata oluştu'
      };
    }
  }

  /**
   * Check if user has any astrology data
   * @param userId - The authenticated user's UID
   * @returns Boolean indicating if user has astrology data
   */
  static async hasUserAstrologyData(userId: string): Promise<{ hasData: boolean; error?: string }> {
    try {
      if (!userId || !supabase) {
        return { hasData: false };
      }

      const { data, error } = await supabase
        .from('astrology_interpretations')
        .select('id')
        .eq('user_id', userId)
        .limit(1);

      if (error && error.code !== 'PGRST116') {
        console.error('Error checking astrology data existence:', error);
        return { hasData: false, error: error.message };
      }

      return { hasData: !!(data && data.length > 0) };

    } catch (error) {
      console.error('Error checking astrology data existence:', error);
      return { 
        hasData: false, 
        error: error instanceof Error ? error.message : 'Beklenmeyen hata' 
      };
    }
  }

  /**
   * Delete user's astrology interpretation (for privacy/GDPR compliance)
   * @param userId - The authenticated user's UID
   * @returns Success status
   */
  static async deleteUserAstrologyData(userId: string): Promise<{ success: boolean; error?: string }> {
    try {
      if (!userId || !supabase) {
        return { success: false, error: 'Geçersiz parametreler' };
      }

      console.log('🗑️ Deleting astrology data for user:', userId);

      const { error } = await supabase
        .from('astrology_interpretations')
        .delete()
        .eq('user_id', userId);

      if (error) {
        console.error('❌ Error deleting astrology data:', error);
        return { success: false, error: error.message };
      }

      console.log('✅ Astrology data deleted successfully for user:', userId);
      return { success: true };

    } catch (error) {
      console.error('💥 Error deleting astrology data:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Silme işlemi başarısız'
      };
    }
  }

  /**
   * Validate astrology interpretation data before storage
   * @param data - Astrology data to validate
   * @returns Validation result with errors if any
   */
  static validateAstrologyData(data: Partial<AstrologyInterpretationData>): {
    isValid: boolean;
    errors: string[];
  } {
    const errors: string[] = [];

    if (!data.user_id) {
      errors.push('Kullanıcı kimliği gerekli');
    }

    if (!data.full_name || data.full_name.trim().length < 2) {
      errors.push('İsim soyisim en az 2 karakter olmalı');
    }

    // Validate zodiac signs if provided
    const validSigns = [
      'Koç', 'Boğa', 'İkizler', 'Yengeç', 'Aslan', 'Başak',
      'Terazi', 'Akrep', 'Yay', 'Oğlak', 'Kova', 'Balık'
    ];

    if (data.sun_sign && !validSigns.includes(data.sun_sign)) {
      errors.push('Geçersiz güneş burcu');
    }

    if (data.moon_sign && !validSigns.includes(data.moon_sign)) {
      errors.push('Geçersiz ay burcu');
    }

    if (data.rising_sign && !validSigns.includes(data.rising_sign)) {
      errors.push('Geçersiz yükselen burç');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }
}