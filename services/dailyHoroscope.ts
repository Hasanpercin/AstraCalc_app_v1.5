import { supabase } from '../lib/supabase';
import { HoroscopeCacheService } from './horoscopeCacheService';

interface DailyHoroscope {
  id: string;
  user_id: string;
  comment: string;
  horoscope_date: string;
  meta: string;
  created_at: string;
  updated_at: string;
}

interface HoroscopeResult {
  horoscope: DailyHoroscope | null;
  error?: string;
  fromCache?: boolean;
}

interface GenerateResult {
  success: boolean;
  horoscope?: DailyHoroscope;
  error?: string;
}

export class DailyHoroscopeService {
  /**
   * Get today's horoscope for a specific user
   */
  static async getTodaysHoroscope(userId: string): Promise<HoroscopeResult> {
    try {
      if (!supabase) {
        // Check cache first even in demo mode
        const cacheResult = await HoroscopeCacheService.getCachedHoroscope(userId);
        if (cacheResult.data && !cacheResult.isExpired) {
          return {
            horoscope: {
              id: 'cached',
              user_id: userId,
              comment: cacheResult.data.comment,
              horoscope_date: cacheResult.data.horoscope_date,
              meta: '',
              created_at: cacheResult.data.cached_at,
              updated_at: cacheResult.data.cached_at
            },
            fromCache: true
          };
        }
        
        return {
          horoscope: null,
          error: 'Supabase not configured'
        };
      }

      // Check cache first to avoid unnecessary database calls
      const today = new Date().toISOString().split('T')[0];
      const cacheResult = await HoroscopeCacheService.getCachedHoroscope(userId, today);
      
      if (cacheResult.data && !cacheResult.isExpired) {
        console.log('📦 Returning cached horoscope for user:', userId);
        return {
          horoscope: {
            id: 'cached',
            user_id: userId,
            comment: cacheResult.data.comment,
            horoscope_date: cacheResult.data.horoscope_date,
            meta: '',
            created_at: cacheResult.data.cached_at,
            updated_at: cacheResult.data.cached_at
          },
          fromCache: true
        };
      }
      console.log('🗃️ Fetching fresh horoscope from database for user:', userId);

      const { data, error } = await supabase
        .from('daily_horoscopes')
        .select('*')
        .eq('user_id', userId)
        .eq('horoscope_date', today)
        .order('created_at', { ascending: false })
        .limit(1);

      if (error) {
        console.error('Error fetching daily horoscope:', error);
        return {
          horoscope: null,
          error: error.message
        };
      }

      // Cache the result if found
      if (data && data.length > 0) {
        const horoscope = data[0];
        await HoroscopeCacheService.cacheHoroscope(
          userId,
          horoscope.comment,
          horoscope.horoscope_date
        );
      }
      return {
        horoscope: data && data.length > 0 ? data[0] : null
      };
    } catch (error) {
      console.error('Daily horoscope fetch error:', error);
      return {
        horoscope: null,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  /**
   * Get horoscope for a specific date
   */
  static async getHoroscopeByDate(userId: string, date: string): Promise<HoroscopeResult> {
    try {
      if (!supabase) {
        return {
          horoscope: null,
          error: 'Supabase not configured'
        };
      }

      const { data, error } = await supabase
        .from('daily_horoscopes')
        .select('*')
        .eq('user_id', userId)
        .eq('horoscope_date', date)
        .order('created_at', { ascending: false })
        .limit(1);

      if (error) {
        console.error('Error fetching horoscope by date:', error);
        return {
          horoscope: null,
          error: error.message
        };
      }

      return {
        horoscope: data && data.length > 0 ? data[0] : null
      };
    } catch (error) {
      console.error('Horoscope by date fetch error:', error);
      return {
        horoscope: null,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  /**
   * Generate today's horoscope for a user (mock implementation)
   * In a real app, this would call an AI service or external API
   */
  static async generateTodaysHoroscope(userId: string): Promise<GenerateResult> {
    try {
      if (!supabase) {
        return {
          success: false,
          error: 'Supabase not configured'
        };
      }

      // Get user's birth data for personalized horoscope
      const { data: birthData, error: birthError } = await supabase
        .from('birth_chart_data')
        .select('full_name, sun_sign, moon_sign, rising_sign')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(1);

      if (birthError) {
        console.error('Error fetching birth data for horoscope:', birthError);
      }

      const userBirthData = birthData && birthData.length > 0 ? birthData[0] : null;

      // Generate personalized horoscope comment
      const horoscopeComment = this.generatePersonalizedComment(userBirthData);

      const today = new Date().toISOString().split('T')[0];

      // Upsert horoscope (insert or update if exists)
      const { data, error } = await supabase
        .from('daily_horoscopes')
        .upsert([
          {
            user_id: userId,
            full_name: userBirthData?.full_name || 'Kullanıcı',
            comment: horoscopeComment,
            horoscope_date: today,
            meta: '',
            updated_at: new Date().toISOString()
          }
        ], {
          onConflict: 'user_id,horoscope_date',
          ignoreDuplicates: false
        })
        .select()
        .single();

      if (error) {
        console.error('Error generating daily horoscope:', error);
        return {
          success: false,
          error: error.message
        };
      }

      // Cache the new horoscope
      await HoroscopeCacheService.cacheHoroscope(
        userId,
        horoscopeComment,
        today
      );
      return {
        success: true,
        horoscope: data
      };
    } catch (error) {
      console.error('Generate horoscope error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  /**
   * Generate personalized horoscope comment based on user data
   */
  private static generatePersonalizedComment(birthData: any): string {
    const today = new Date();
    const dayOfWeek = today.toLocaleDateString('tr-TR', { weekday: 'long' });
    const dateStr = today.toLocaleDateString('tr-TR', { day: 'numeric', month: 'long' });
    
    const comments = [
      // General positive comments
      `${dayOfWeek} günü size güzel fırsatlar sunacak. İçgüdülerinizi takip edin ve yaratıcı projelerinize odaklanın.`,
      `${dateStr} tarihinde yıldızlar lehinizdе. Yeni başlangıçlar için mükemmel bir zaman. Cesaretinizi toplayın ve harekete geçin.`,
      `Bugün yaratıcılığınızın zirvesinde olacaksınız. Sanatsal projelerinize ve hobilerinize zaman ayırın.`,
      `Finansal konularda dikkatli davranmanız gereken bir gün. Tasarruf etme fırsatlarını değerlendirin.`,
      `Bugün duygusal dengenizi korumanız önemli. Sevdiklerinizle vakit geçirin ve iç huzurunuzu bulun.`,
      `Kariyerinizde önemli adımlar atmaya hazır olun. ${dayOfWeek} günü aldığınız kararlar geleceğinizi şekillendirebilir.`,
      `İletişim becerileriniz bugün ön planda. Önemli görüşmeler ve yeni bağlantılar kurma zamanı.`,
      `Sezgileriniz ${dateStr} tarihinde çok güçlü. İç sesinizi dinleyin ve kalbinizin sesini takip edin.`,
    ];

    // Add personalized elements if birth data is available
    if (birthData) {
      const personalizedComments = [
        `Sevgili ${birthData.full_name || 'Değerli Arkadaşım'}, ${dayOfWeek} günü ${birthData.sun_sign || 'güneş burcu'} enerjinizle parlayacaksınız. İç gücünüzü keşfedin ve hayallerinize doğru adım atın.`,
        `${birthData.full_name || 'Değerli Dostum'}, ${birthData.moon_sign || 'ay burcu'} sezgileriniz ${dateStr} tarihinde güçlü. Duygusal zekânızı kullanarak doğru kararlar verin.`,
        `${dayOfWeek} günü ${birthData.rising_sign || 'yükselen burç'} enerjinizle çevrenizde pozitif değişimler yaratabilirsiniz, ${birthData.full_name || 'sevgili dostum'}.`,
      ];
      
      comments.push(...personalizedComments);
    }

    // Return a random comment
    const randomIndex = Math.floor(Math.random() * comments.length);
    return comments[randomIndex];
  }

  /**
   * Get recent horoscopes for a user (last 7 days)
   */
  static async getRecentHoroscopes(userId: string, days: number = 7): Promise<{
    horoscopes: DailyHoroscope[];
    error?: string;
  }> {
    try {
      if (!supabase) {
        return {
          horoscopes: [],
          error: 'Supabase not configured'
        };
      }

      const endDate = new Date();
      const startDate = new Date();
      startDate.setDate(endDate.getDate() - days);

      const { data, error } = await supabase
        .from('daily_horoscopes')
        .select('*')
        .eq('user_id', userId)
        .gte('horoscope_date', startDate.toISOString().split('T')[0])
        .lte('horoscope_date', endDate.toISOString().split('T')[0])
        .order('horoscope_date', { ascending: false });

      if (error) {
        console.error('Error fetching recent horoscopes:', error);
        return {
          horoscopes: [],
          error: error.message
        };
      }

      return {
        horoscopes: data || []
      };
    } catch (error) {
      console.error('Recent horoscopes fetch error:', error);
      return {
        horoscopes: [],
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  /**
   * Delete old horoscopes (cleanup function)
   */
  static async cleanupOldHoroscopes(daysToKeep: number = 30): Promise<{
    success: boolean;
    deleted?: number;
    error?: string;
  }> {
    try {
      if (!supabase) {
        return {
          success: false,
          error: 'Supabase not configured'
        };
      }

      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - daysToKeep);

      const { error } = await supabase
        .from('daily_horoscopes')
        .delete()
        .lt('horoscope_date', cutoffDate.toISOString().split('T')[0]);

      if (error) {
        console.error('Error cleaning up old horoscopes:', error);
        return {
          success: false,
          error: error.message
        };
      }

      return {
        success: true,
        deleted: 0 // Supabase delete doesn't return count by default
      };
    } catch (error) {
      console.error('Cleanup error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }
}
