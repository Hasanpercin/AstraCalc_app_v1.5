import AsyncStorage from '@react-native-async-storage/async-storage';

export interface StoredChatMessage {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: string; // ISO string for consistent timezone handling
  user_id?: string;
}

interface ChatSession {
  messages: StoredChatMessage[];
  created_at: string;
  last_activity: string;
}

/**
 * AI Chat Message Storage Service with 5-day retention policy
 * Manages local storage of chat messages with automatic cleanup
 */
export class ChatMessageStorageService {
  private static readonly STORAGE_KEY_PREFIX = 'ai_chat_messages_';
  private static readonly RETENTION_DAYS = 5;
  private static readonly RETENTION_MS = 5 * 24 * 60 * 60 * 1000; // 5 days in milliseconds
  private static readonly MAX_MESSAGES_PER_USER = 500; // Prevent excessive memory usage

  /**
   * Get storage key for specific user
   */
  private static getStorageKey(userId: string): string {
    return `${this.STORAGE_KEY_PREFIX}${userId}`;
  }

  /**
   * Load chat messages for a specific user with automatic cleanup
   */
  static async loadUserMessages(userId: string): Promise<{
    messages: StoredChatMessage[];
    error?: string;
  }> {
    try {
      console.log('📥 Loading chat messages for user:', userId);
      
      const storageKey = this.getStorageKey(userId);
      const storedData = await AsyncStorage.getItem(storageKey);
      
      if (!storedData) {
        console.log('ℹ️ No existing chat messages found for user');
        return { messages: [] };
      }

      const chatSession: ChatSession = JSON.parse(storedData);
      const now = new Date();
      
      // Filter out messages older than 5 days
      const validMessages = chatSession.messages.filter(message => {
        const messageDate = new Date(message.timestamp);
        const ageInMs = now.getTime() - messageDate.getTime();
        return ageInMs <= this.RETENTION_MS;
      });

      console.log(`🧹 Filtered ${chatSession.messages.length - validMessages.length} expired messages`);
      console.log(`📝 Loaded ${validMessages.length} valid messages`);

      // If we filtered out any messages, save the cleaned data
      if (validMessages.length !== chatSession.messages.length) {
        await this.saveUserMessages(userId, validMessages);
      }

      return { messages: validMessages };

    } catch (error) {
      console.error('❌ Error loading chat messages:', error);
      return {
        messages: [],
        error: error instanceof Error ? error.message : 'Message loading failed'
      };
    }
  }

  /**
   * Save chat messages for a specific user
   */
  static async saveUserMessages(
    userId: string, 
    messages: StoredChatMessage[]
  ): Promise<{ success: boolean; error?: string }> {
    try {
      console.log(`💾 Saving ${messages.length} messages for user:`, userId);
      
      // Enforce message limit to prevent excessive memory usage
      const limitedMessages = messages.slice(-this.MAX_MESSAGES_PER_USER);
      
      if (limitedMessages.length < messages.length) {
        console.log(`⚠️ Trimmed to ${this.MAX_MESSAGES_PER_USER} most recent messages`);
      }

      const chatSession: ChatSession = {
        messages: limitedMessages,
        created_at: new Date().toISOString(),
        last_activity: new Date().toISOString()
      };

      const storageKey = this.getStorageKey(userId);
      await AsyncStorage.setItem(storageKey, JSON.stringify(chatSession));
      
      console.log('✅ Chat messages saved successfully');
      return { success: true };

    } catch (error) {
      console.error('❌ Error saving chat messages:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Message saving failed'
      };
    }
  }

  /**
   * Add a new message to user's chat history
   */
  static async addMessage(
    userId: string, 
    message: Omit<StoredChatMessage, 'timestamp'>
  ): Promise<{ success: boolean; error?: string }> {
    try {
      // Load existing messages
      const { messages: existingMessages, error: loadError } = await this.loadUserMessages(userId);
      
      if (loadError) {
        console.warn('⚠️ Could not load existing messages:', loadError);
      }

      // Create new message with current timestamp
      const newMessage: StoredChatMessage = {
        ...message,
        timestamp: new Date().toISOString(),
        user_id: userId
      };

      // Add to existing messages
      const updatedMessages = [...(existingMessages || []), newMessage];
      
      // Save updated messages
      return await this.saveUserMessages(userId, updatedMessages);

    } catch (error) {
      console.error('❌ Error adding message:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Message addition failed'
      };
    }
  }

  /**
   * Clean up all expired messages across all users
   */
  static async cleanupExpiredMessages(): Promise<{
    success: boolean;
    cleanedUsers: number;
    deletedMessages: number;
    error?: string;
  }> {
    try {
      console.log('🧹 Starting global message cleanup...');
      
      const allKeys = await AsyncStorage.getAllKeys();
      const chatKeys = allKeys.filter(key => key.startsWith(this.STORAGE_KEY_PREFIX));
      
      let cleanedUsers = 0;
      let totalDeletedMessages = 0;
      const now = new Date();

      for (const key of chatKeys) {
        try {
          const userId = key.replace(this.STORAGE_KEY_PREFIX, '');
          const { messages, error } = await this.loadUserMessages(userId);
          
          if (error) {
            console.warn(`⚠️ Could not load messages for user ${userId}:`, error);
            continue;
          }

          const originalCount = messages.length;
          const validMessages = messages.filter(message => {
            const messageDate = new Date(message.timestamp);
            const ageInMs = now.getTime() - messageDate.getTime();
            return ageInMs <= this.RETENTION_MS;
          });

          if (validMessages.length < originalCount) {
            await this.saveUserMessages(userId, validMessages);
            cleanedUsers++;
            totalDeletedMessages += (originalCount - validMessages.length);
          }

        } catch (userError) {
          console.warn(`⚠️ Error cleaning messages for key ${key}:`, userError);
        }
      }

      console.log(`✅ Cleanup complete: ${cleanedUsers} users, ${totalDeletedMessages} messages deleted`);
      
      return {
        success: true,
        cleanedUsers,
        deletedMessages: totalDeletedMessages
      };

    } catch (error) {
      console.error('❌ Global cleanup error:', error);
      return {
        success: false,
        cleanedUsers: 0,
        deletedMessages: 0,
        error: error instanceof Error ? error.message : 'Cleanup failed'
      };
    }
  }

  /**
   * Clear all chat messages for a specific user
   */
  static async clearUserMessages(userId: string): Promise<{ success: boolean; error?: string }> {
    try {
      const storageKey = this.getStorageKey(userId);
      await AsyncStorage.removeItem(storageKey);
      
      console.log('🗑️ Cleared all chat messages for user:', userId);
      return { success: true };

    } catch (error) {
      console.error('❌ Error clearing user messages:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Clear operation failed'
      };
    }
  }

  /**
   * Get storage statistics for monitoring
   */
  static async getStorageStats(): Promise<{
    totalUsers: number;
    totalMessages: number;
    expiredMessages: number;
    storageSizeKB: number;
  }> {
    try {
      const allKeys = await AsyncStorage.getAllKeys();
      const chatKeys = allKeys.filter(key => key.startsWith(this.STORAGE_KEY_PREFIX));
      
      let totalMessages = 0;
      let expiredMessages = 0;
      let totalSize = 0;
      const now = new Date();

      for (const key of chatKeys) {
        try {
          const storedData = await AsyncStorage.getItem(key);
          if (!storedData) continue;
          
          totalSize += storedData.length;
          const chatSession: ChatSession = JSON.parse(storedData);
          
          chatSession.messages.forEach(message => {
            totalMessages++;
            const messageDate = new Date(message.timestamp);
            const ageInMs = now.getTime() - messageDate.getTime();
            if (ageInMs > this.RETENTION_MS) {
              expiredMessages++;
            }
          });

        } catch (e) {
          console.warn(`⚠️ Could not process key ${key} for stats:`, e);
        }
      }

      return {
        totalUsers: chatKeys.length,
        totalMessages,
        expiredMessages,
        storageSizeKB: Math.round(totalSize / 1024)
      };

    } catch (error) {
      console.error('❌ Error getting storage stats:', error);
      return {
        totalUsers: 0,
        totalMessages: 0,
        expiredMessages: 0,
        storageSizeKB: 0
      };
    }
  }

  /**
   * Schedule automatic cleanup to run periodically
   */
  static setupPeriodicCleanup(): () => void {
    // Run cleanup every 6 hours
    const cleanupInterval = setInterval(() => {
      this.cleanupExpiredMessages();
    }, 6 * 60 * 60 * 1000);

    console.log('⏰ Periodic message cleanup scheduled (every 6 hours)');

    // Return cleanup function
    return () => {
      clearInterval(cleanupInterval);
      console.log('🛑 Periodic cleanup stopped');
    };
  }
}
