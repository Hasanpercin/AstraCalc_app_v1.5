import { supabase } from '../lib/supabase';
import { NatalChartData } from '../types';
import { LocalStorageService } from './localStorage';
import { AstrologyDataService } from './astrologyDataService';

interface BirthData {
  fullName: string;
  birthDate: string;
  birthTime: string;
  birthPlace: string;
  userId?: string;
}

interface ParsedBirthChartData {
  sunSign?: string;
  moonSign?: string;
  risingSign?: string;
  interpretation?: string;
  rawResponse: string;
}

export class WebhookService {
  private static readonly WEBHOOK_URL = 'https://n8n.hasanpercin.xyz/webhook/33157954-4d52-4a48-9ed2-bf7f910b149d';
  private static readonly AI_CHAT_WEBHOOK_URL = 'https://n8n.hasanpercin.xyz/webhook/0f44157c-3e8d-44d5-8d6e-68eb50da3ba0';

  // Parse webhook response to extract birth chart data
  static parseBirthChartResponse(responseText: string): ParsedBirthChartData {
    console.log('Parsing webhook response:', responseText);
    
    const data: ParsedBirthChartData = {
      rawResponse: responseText,
    };

    try {
      // Handle different response formats
      let textToParse = responseText;
      
      // If response is wrapped in quotes, remove them
      if (textToParse.startsWith('"') && textToParse.endsWith('"')) {
        textToParse = textToParse.slice(1, -1);
      }
      
      // Remove outer parentheses if they exist
      if (textToParse.startsWith('(') && textToParse.endsWith(')')) {
        textToParse = textToParse.slice(1, -1).trim();
      }

      // Extract Doğum Haritası Yorumu (Birth Chart Interpretation)
      const interpretationMatch = textToParse.match(/Doğum Haritası Yorumu[:\s]*([\s\S]*)/i);
      if (interpretationMatch) {
        data.interpretation = interpretationMatch[1].trim();
      } else {
        // If no specific section found, use the entire text as interpretation
        data.interpretation = textToParse;
      }

      // Extract astrology signs if available
      const sunSignMatch = textToParse.match(/Güneş[:\s]*([^\n,]+)/i);
      if (sunSignMatch) {
        data.sunSign = sunSignMatch[1].trim();
      }

      const moonSignMatch = textToParse.match(/Ay[:\s]*([^\n,]+)/i);
      if (moonSignMatch) {
        data.moonSign = moonSignMatch[1].trim();
      }

      const risingSignMatch = textToParse.match(/Yükselen[:\s]*([^\n,]+)/i);
      if (risingSignMatch) {
        data.risingSign = risingSignMatch[1].trim();
      }
      
    } catch (error) {
      console.error('Error parsing birth chart response:', error);
      data.interpretation = responseText; // Fallback to raw response
    }

    return data;
  }

  // Store birth chart data in Supabase
  static async storeBirthChartData(
    birthData: BirthData,
    parsedData: ParsedBirthChartData
  ): Promise<{ success: boolean; error?: string }> {
    console.log('Storing birth chart data for user:', birthData.userId);

    // First try localStorage as fallback
    // Ensure birth_date is in DD-MM-YYYY format
    let formattedBirthDate = birthData.birthDate;
    if (formattedBirthDate.match(/^\d{4}-\d{2}-\d{2}$/)) {
      const parts = formattedBirthDate.split('-');
      formattedBirthDate = `${parts[2]}-${parts[1]}-${parts[0]}`;
    }
    
    const localData = {
      fullName: birthData.fullName,
      birthDate: formattedBirthDate,
      birthTime: birthData.birthTime,
      birthPlace: birthData.birthPlace,
      sunSign: parsedData.sunSign,
      moonSign: parsedData.moonSign,
      risingSign: parsedData.risingSign,
      interpretation: parsedData.interpretation,
      timestamp: new Date().toISOString()
    };
    
    const localStorageResult = await LocalStorageService.storeBirthChartData(localData);
    if (!localStorageResult.success) {
      console.warn('AsyncStorage failed:', localStorageResult.error);
    }

    try {
      if (!supabase) {
        return localStorageResult.success 
          ? { success: true }
          : { success: false, error: 'Hem Supabase hem localStorage başarısız' };
      }

      // Use upsert to update existing data or insert new data
      const { error: birthDataError } = await supabase
        .from('birth_chart_data')
        .upsert([
          {
            user_id: birthData.userId,
            full_name: birthData.fullName,
            birth_date: formattedBirthDate,
            birth_time: birthData.birthTime,
            birth_place: birthData.birthPlace,
            sun_sign: parsedData.sunSign || '',
            moon_sign: parsedData.moonSign || '',
            rising_sign: parsedData.risingSign || '',
            interpretation: parsedData.interpretation || '',
          },
        ]);

      if (birthDataError) {
        console.error('Birth chart data storage error:', birthDataError);
        return localStorageResult.success 
          ? { success: true }
          : { success: false, error: birthDataError.message };
      }

      // Store the interpretation in astrology_interpretations table if available
      if (parsedData.interpretation && birthData.userId) {
        const astrologyData = {
          full_name: birthData.fullName,
          dogum_tarihi: formattedBirthDate,
          dogum_saati: birthData.birthTime,
          dogum_yeri: birthData.birthPlace,
          sun_sign: parsedData.sunSign || '',
          moon_sign: parsedData.moonSign || '',
          rising_sign: parsedData.risingSign || '',
          interpretation: parsedData.interpretation
        };
        
        await AstrologyDataService.storeUserAstrologyInterpretation(
          birthData.userId,
          astrologyData
        );
      }

      console.log('Birth chart data stored successfully');
      return { success: true };
    } catch (error) {
      console.error('Critical storage error:', error);
      return localStorageResult.success 
        ? { success: true }
        : { success: false, error: error instanceof Error ? error.message : 'Unknown storage error' };
    }
  }

  // Get user's birth chart data from Supabase
  static async getBirthChartData(userId: string): Promise<{ data: any | null; error?: string }> {
    console.log('🔍 getBirthChartData called for user:', userId);
    
    // Validate user ID
    if (!userId) {
      console.warn('⚠️ No user ID provided to getBirthChartData');
      return { data: null, error: 'User ID required for data retrieval' };
    }
    
    try {
      if (!supabase) {
        console.log('⚠️ Supabase not configured, using AsyncStorage as fallback');
        const localResult = await LocalStorageService.getBirthChartData();
        if (localResult.data) {
          console.log('Birth chart data loaded from AsyncStorage (Supabase not configured)');
          return { data: localResult.data };
        }
        return { data: null, error: 'Supabase not configured and no AsyncStorage data' };
      }

      const { data, error } = await supabase
        .from('birth_chart_data')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(1);

      if (error) {
        console.error('Supabase query error:', error);
        
        // Try AsyncStorage as fallback
        console.log('Trying AsyncStorage as fallback...');
        const localResult = await LocalStorageService.getBirthChartData();
        if (localResult.data) {
          console.log('Birth chart data loaded from AsyncStorage (Supabase failed)');
          return { data: localResult.data };
        }
        
        return { data: null, error: error.message };
      }

      if (data && data.length > 0) {
        console.log('✅ Birth chart data found for user');
        return { data: data[0] };
      } else {
        console.log('📭 No birth chart data found in Supabase, checking AsyncStorage...');
        
        // Try AsyncStorage as fallback
        const localResult = await LocalStorageService.getBirthChartData();
        if (localResult.data) {
          console.log('Birth chart data loaded from AsyncStorage (not found in Supabase)');
          return { data: localResult.data };
        }
        
        return { data: null };
      }
    } catch (error) {
      console.error('🔥 Critical error in getBirthChartData:', error);
      
      // Try AsyncStorage as final fallback
      try {
        const localResult = await LocalStorageService.getBirthChartData();
        if (localResult.data) {
          console.log('Birth chart data loaded from AsyncStorage (critical error fallback)');
          return { data: localResult.data };
        }
      } catch (localError) {
        console.error('AsyncStorage fallback also failed:', localError);
      }
      
      return { 
        data: null, 
        error: error instanceof Error ? error.message : 'Unknown critical error' 
      };
    }
  }

  // Store natal chart data received from webhook
  static async storeNatalChartData(chartData: any, userId: string): Promise<{ success: boolean; error?: string }> {
    try {
      if (!supabase) {
        throw new Error('Supabase not configured');
      }

      const { error } = await supabase
        .from('natal_charts')
        .upsert([
          {
            user_id: userId,
            sun_sign: chartData.sun_sign || '',
            moon_sign: chartData.moon_sign || '',
            rising_sign: chartData.rising_sign || '',
            planetary_positions: chartData.planetary_positions || [],
            houses: chartData.houses || [],
            interpretation: chartData.interpretation || '',
            compatibility_notes: chartData.compatibility_notes || '',
          },
        ]);

      if (error) {
        throw error;
      }

      return { success: true };
    } catch (error) {
      console.error('Natal chart storage error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  // Get user's natal chart data
  static async getNatalChartData(userId?: string): Promise<{ data: NatalChartData | null; error?: string }> {
    try {
      if (!supabase) {
        throw new Error('Supabase not configured');
      }

      const { data, error } = await supabase
        .from('natal_charts')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(1);

      if (error) {
        throw error;
      }

      return { data: data ? data[0] : null };
    } catch (error) {
      console.error('Natal chart retrieval error:', error);
      return {
        data: null,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  static async sendBirthData(birthData: BirthData): Promise<{ success: boolean; data?: any; error?: string }> {
    console.log('🎯 sendBirthData function entry - starting birth data processing');
    console.log('📊 Input birthData object:', JSON.stringify(birthData, null, 2));
    
    try {
      console.log('🔧 Preparing webhook payload...');
      // Prepare webhook payload
      const webhookPayload = {
        fullName: birthData.fullName,
        birthDate: birthData.birthDate,
        birthTime: birthData.birthTime,
        birthPlace: birthData.birthPlace,
        userId: birthData.userId || 'anonymous',
        timestamp: new Date().toISOString(),
        source: 'astrocalc-mobile',
      };

      console.log('Sending birth data to webhook:', webhookPayload);
      console.log('🌐 Webhook URL:', this.WEBHOOK_URL);
      console.log('🚀 About to start fetch request...');

      let response;
      try {
        console.log('🌐 Initiating fetch request to:', this.WEBHOOK_URL);
        console.log('📤 Request method: POST');
        console.log('📋 Request headers preparing...');
        
        const requestHeaders = {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'User-Agent': 'Astrocalc-iOS-App/1.0.0',
        };
        console.log('📋 Request headers prepared:', requestHeaders);
        
        const requestBody = JSON.stringify(webhookPayload);
        console.log('📦 Request body length:', requestBody.length);
        console.log('📦 Request body first 100 chars:', requestBody.substring(0, 100));
        
        // Create AbortController for better iOS compatibility
        const controller = new AbortController();
        const timeoutId = setTimeout(() => {
          console.log('⏰ Request timeout triggered - aborting fetch');
          controller.abort();
        }, 30000);
        
        console.log('🚀 Starting fetch call now...');
        response = await fetch(this.WEBHOOK_URL, {
          method: 'POST',
          headers: requestHeaders,
          body: requestBody,
          signal: controller.signal,
        });
        
        clearTimeout(timeoutId);
        console.log('✅ Fetch call completed successfully');
        
      } catch (fetchError) {
        console.error('❌ Fetch call failed with error:', fetchError);
        console.error('❌ Fetch error type:', typeof fetchError);
        console.error('❌ Fetch error message:', fetchError instanceof Error ? fetchError.message : 'Unknown fetch error');
        throw fetchError;
      }

      console.log('📡 Webhook response status:', response.status);
      console.log('📡 Webhook response headers:', response.headers);

      // Check if response is OK and has JSON content type
      const contentType = response.headers.get('Content-Type') || '';
      const isJson = contentType.includes('application/json');
      
      console.log('📋 Response Content-Type:', contentType);
      console.log('🔍 Is JSON response:', isJson);
      
      if (!response.ok) {
        console.log('❌ Response not OK, processing error...');
        // Try to get error message from response body
        let errorMessage;
        try {
          if (isJson) {
            const errorData = await response.json();
            errorMessage = errorData.error || errorData.message || `HTTP ${response.status}`;
          } else {
            const textResponse = await response.text();
            errorMessage = textResponse || `HTTP ${response.status}`;
          }
        } catch (e) {
          errorMessage = `HTTP ${response.status}`;
        }
        console.error('❌ Webhook error response:', errorMessage);
        
        // Handle 429 (rate limit) errors specially - return clean message
        if (response.status === 429) {
          // Return the clean message without "AI Webhook hatası:" prefix for rate limits
          throw new Error(errorMessage);
        } else {
          // For other errors, keep the prefix for clarity
          throw new Error(`AI Webhook hatası (${response.status}): ${errorMessage}`);
        }
      }

      console.log('✅ Response OK, processing response data...');
      // Parse response data safely
      let responseData;
      try {
        console.log('📥 Reading response text...');
        if (isJson) {
          const responseText = await response.text();
          console.log('📥 Response text length:', responseText.length);
          console.log('📥 Response text first 200 chars:', responseText.substring(0, 200));
          if (!responseText.trim()) {
            throw new Error('Webhook boş yanıt döndürdü');
          }
          responseData = JSON.parse(responseText);
        } else {
          // If not JSON, treat as text response
          responseData = await response.text();
        }
      } catch (parseError) {
        console.error('JSON parse error:', parseError);
        // If JSON parsing fails, try to get the raw text
        responseData = await response.text().catch(() => 'Yanıt okunamadı');
      }
      
      console.log('✅ Webhook response received:', responseData);

      // Parse the response data
      console.log('🔄 Parsing webhook response...');
      const responseText = typeof responseData === 'string' ? responseData : JSON.stringify(responseData);
      const parsedData = this.parseBirthChartResponse(responseText);
      console.log('📊 Parsed birth chart data:', parsedData);
      
      // Store in Supabase if user is authenticated
      console.log('💾 Storing birth chart data...');
      if (birthData.userId && birthData.userId !== 'demo-user' && supabase) {
        const storageResult = await this.storeBirthChartData(birthData, parsedData);
        if (!storageResult.success) {
          console.warn('Failed to store in Supabase:', storageResult.error);
        }
      } else {
        console.log('💾 Skipping Supabase storage - demo user or no supabase');
      }

      // Store the complete data in global state for immediate use
      console.log('🌍 Setting global birth chart data...');
      const storedData = {
        ...parsedData,
        birthData: webhookPayload,
        timestamp: new Date().toISOString(),
      };
      
      global.birthChartData = storedData;
      console.log('✅ Global data set successfully');

      console.log('🎉 Webhook request completed successfully');
      return {
        success: true,
        data: parsedData,
      };
    } catch (error) {
      console.error('💥 Critical error in sendBirthData:', error);
      console.error('💥 Error name:', error instanceof Error ? error.name : 'Unknown');
      console.error('💥 Error message:', error instanceof Error ? error.message : 'Unknown error');
      console.error('💥 Error stack:', error instanceof Error ? error.stack : 'No stack trace');
      console.error('❌ Webhook request failed:', error);
      console.error('❌ Error details:', {
        message: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : null
      });
      
      // Provide more specific error messages for iOS users
      let userFriendlyError = 'Doğum haritası oluşturulurken bir hata oluştu.';
      
      if (error instanceof Error) {
        if (error.message.includes('Network request failed') || error.message.includes('No suitable URL request handler')) {
          userFriendlyError = 'İnternet bağlantınızı kontrol edin ve tekrar deneyin.';
        } else if (error.message.includes('timeout')) {
          userFriendlyError = 'İstek zaman aşımına uğradı. Lütfen tekrar deneyin.';
        } else if (error.message.includes('AbortError')) {
          userFriendlyError = 'İstek iptal edildi. Lütfen tekrar deneyin.';
        } else if (error.message.includes('hhttps') || error.message.includes('suitable URL request handler')) {
          userFriendlyError = 'Sunucu adresi hatalı. Lütfen uygulamayı yeniden başlatın.';
        } else if (error.message.includes('TypeError') && error.message.includes('fetch')) {
          userFriendlyError = 'Ağ isteği başlatılamadı. İnternet bağlantınızı kontrol edin.';
        }
      }
      
      return {
        success: false,
        error: userFriendlyError,
      };
    }
  }

  // Clear global birth chart data
  static clearStoredBirthChartData(): void {
    try {
      global.birthChartData = null;
    } catch (error) {
      console.error('Error clearing stored birth chart data:', error);
    }
  }

  private static async storeBirthDataLocally(birthData: BirthData, userId: string) {
    if (!supabase) {
      throw new Error('Supabase not configured');
    }

    const { error } = await supabase
      .from('birth_data')
      .upsert([
        {
          user_id: userId,
          full_name: birthData.fullName,
          birth_date: birthData.birthDate,
          birth_time: birthData.birthTime,
          birth_place: birthData.birthPlace,
        },
      ]);

    if (error) {
      console.error('Local storage error:', error);
      throw error;
    }
  }

  static async getBirthData(userId: string) {
    if (!supabase) {
      throw new Error('Supabase not configured');
    }

    const { data, error } = await supabase
      .from('birth_chart_data')
      .select('full_name,birth_date,birth_time,birth_place')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(1);

    return { data: data ? data[0] : null, error };
  }

  /**
   * Convert JSON webhook response to human-readable Turkish text format
   */
  static formatWebhookResponseToText(responseData: any): string {
    if (!responseData) return '';

    // Handle AI chat response format: [{"message": {"content": "text"}}]
    if (Array.isArray(responseData) && responseData.length > 0) {
      const firstItem = responseData[0];
      if (firstItem?.message?.content) {
        return this.cleanupTextResponse(firstItem.message.content);
      }
    }

    // Handle direct message format: {"message": {"content": "text"}}
    if (responseData?.message?.content) {
      return this.cleanupTextResponse(responseData.message.content);
    }

    // If it's already a string, check if it's JSON and parse it
    if (typeof responseData === 'string') {
      // Try to parse if it looks like JSON
      if (responseData.trim().startsWith('{') || responseData.trim().startsWith('[')) {
        try {
          const parsed = JSON.parse(responseData);
          return this.formatWebhookResponseToText(parsed);
        } catch (e) {
          // If parsing fails, treat as plain text
          return this.cleanupTextResponse(responseData);
        }
      }
      return this.cleanupTextResponse(responseData);
    }

    try {
      const formatValue = (value: any, indent: string = ''): string => {
        if (value === null || value === undefined) {
          return 'Belirtilmemiş';
        }

        if (typeof value === 'string') {
          return value;
        }

        if (typeof value === 'number' || typeof value === 'boolean') {
          return String(value);
        }

        if (Array.isArray(value)) {
          if (value.length === 0) return 'Liste boş';
          return value.map((item, index) => 
            `${indent}${index + 1}. ${formatValue(item, indent + '   ')}`
          ).join('\n');
        }

        if (typeof value === 'object') {
          return Object.entries(value)
            .map(([key, val]) => `${indent}• ${this.translateFieldName(key)}: ${formatValue(val, indent + '  ')}`)
            .join('\n');
        }

        return String(value);
      };

      // Extract main response content
      let mainContent = '';
      
      // Check for common response fields in priority order
      if (responseData.output || responseData.answer || responseData.response || responseData.message || responseData.text) {
        const content = responseData.output || responseData.answer || responseData.response || responseData.message || responseData.text;
        if (typeof content === 'string') {
          return this.cleanupTextResponse(content);
        }
        mainContent = formatValue(content);
      } else {
        // Format entire object
        mainContent = formatValue(responseData);
      }

      return mainContent;
    } catch (error) {
      console.error('Error formatting webhook response:', error);
      return 'Yanıt formatlanırken hata oluştu.';
    }
  }

  /**
   * Clean up text response by removing JSON artifacts and formatting properly
   */
  private static cleanupTextResponse(text: string): string {
    if (!text) return '';

    let cleaned = text;
    
    // Remove JSON wrapper quotes if present
    if (cleaned.startsWith('"') && cleaned.endsWith('"')) {
      cleaned = cleaned.slice(1, -1);
    }
    
    // Convert escaped newlines to actual newlines
    cleaned = cleaned.replace(/\\n/g, '\n');
    
    // Convert escaped quotes
    cleaned = cleaned.replace(/\\"/g, '"');
    cleaned = cleaned.replace(/\\'/g, "'");
    
    // Trim extra whitespace
    return cleaned.trim();
  }

  /**
   * Translate common field names to Turkish
   */
  private static translateFieldName(fieldName: string): string {
    const translations: Record<string, string> = {
      'user_id': 'Kullanıcı ID',
      'full_name': 'İsim Soyisim',
      'name': 'İsim',
      'email': 'E-posta',
      'phone': 'Telefon',
      'status': 'Durum',
      'created_at': 'Oluşturma Tarihi',
      'updated_at': 'Güncelleme Tarihi',
      'birth_date': 'Doğum Tarihi',
      'birth_time': 'Doğum Saati',
      'birth_place': 'Doğum Yeri',
      'sun_sign': 'Güneş Burcu',
      'moon_sign': 'Ay Burcu',
      'rising_sign': 'Yükselen Burç',
      'question': 'Soru',
      'answer': 'Cevap',
      'response': 'Yanıt',
      'message': 'Mesaj',
      'text': 'Metin',
      'today': 'Bugün',
      'timestamp': 'Zaman Damgası',
      'source': 'Kaynak',
      'success': 'Başarılı',
      'error': 'Hata',
      'data': 'Veri',
      'output': 'Çıktı'
    };

    return translations[fieldName.toLowerCase()] || fieldName.charAt(0).toUpperCase() + fieldName.slice(1);
  }

  // Send AI chat message to webhook and get response
  static async sendAIChatMessage(
    userMessage: string,
    userId?: string,
    fullName?: string
  ): Promise<{ success: boolean; response?: string; error?: string }> {
    try {
      console.log('🤖 Sending AI chat message to webhook:', userMessage);
      console.log('🌐 AI Chat Webhook URL:', this.AI_CHAT_WEBHOOK_URL);

      // Get current date in DD-MM-YYYY format
      const today = new Date();
      const formattedDate = `${String(today.getDate()).padStart(2, '0')}-${String(today.getMonth() + 1).padStart(2, '0')}-${today.getFullYear()}`;

      const payload = {
        question: userMessage.trim(),
        userId: userId || 'anonymous',
        full_name: fullName || null,
        today: formattedDate,
        timestamp: new Date().toISOString(),
        source: 'astrocalc-ai-chat',
      };

      console.log('📦 AI Chat payload:', payload);

      const response = await fetch(this.AI_CHAT_WEBHOOK_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json; charset=utf-8',
        },
        body: JSON.stringify(payload),
      });

      console.log('📡 AI Chat webhook response status:', response.status);
      console.log('📡 AI Chat webhook response headers:', Object.fromEntries(response.headers.entries()));

      if (!response.ok) {
        let errorMessage;
        try {
          const errorData = await response.text();
          errorMessage = errorData || `HTTP ${response.status}`;
        } catch (e) {
          errorMessage = `HTTP ${response.status}`;
        }
        console.error('❌ AI Chat webhook error response:', errorMessage);
        throw new Error(errorMessage);
      }

      // Parse response data
      let responseData;
      try {
        const responseText = await response.text();
        console.log('📨 Raw AI Chat response:', responseText);
        
        if (!responseText.trim()) {
          throw new Error('AI Webhook boş yanıt döndürdü');
        }

        // Try to parse as JSON first
        const contentType = response.headers.get('Content-Type') || '';
        if (contentType.includes('application/json')) {
          responseData = JSON.parse(responseText);
        } else {
          // If not JSON, treat as plain text
          responseData = { response: responseText };
        }
      } catch (parseError) {
        console.error('JSON parse error:', parseError);
        // If parsing fails, use the raw text as response
        const rawText = await response.text().catch(() => 'Yanıt okunamadı');
        responseData = { response: rawText };
      }

      console.log('✅ AI Chat webhook response received:', responseData);

      // Extract the AI response from various possible fields
      // Let formatWebhookResponseToText handle all the extraction and formatting
      const formattedResponse = this.formatWebhookResponseToText(responseData);
      
      if (!formattedResponse || formattedResponse.trim().length === 0) {
        throw new Error('AI Webhook geçerli bir yanıt döndürmedi');
      }

      console.log('🎉 AI Chat request completed successfully');
      return {
        success: true,
        response: formattedResponse,
      };
    } catch (error) {
      console.error('❌ AI Chat webhook request failed:', error instanceof Error ? error.message : 'Unknown error');
      console.error('❌ Error details:', {
        message: error instanceof Error ? error.message.replace(/^AI Webhook hatası:\s*/, '') : 'Unknown error',
        stack: error instanceof Error ? error.stack : null
      });
      
      return {
        success: false,
        error: error instanceof Error ? error.message.replace(/^AI Webhook hatası:\s*/, '') : 'Bilinmeyen AI webhook hatası',
      };
    }
  }
}