import React, { useState, useEffect } from 'react';
import { useRef } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Alert
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Sparkles, Send, Bot, User, Trash2 } from 'lucide-react-native';
import { useAuth } from '../../hooks/useAuth';
import { supabase } from '../../lib/supabase';
import { WebhookService } from '../../services/webhook';
import { ChatMessageStorageService, StoredChatMessage } from '../../services/chatMessageStorage';

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

export default function AIScreen() {
  const { user } = useAuth();
  const scrollViewRef = useRef<ScrollView>(null);
  const cleanupRef = useRef<(() => void) | null>(null);
  const [userFullName, setUserFullName] = useState<string>('');
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Merhaba! Ben Astrocalc AI\'ım. Astroloji hakkında sorularınızı yanıtlamak için buradayım. Nasıl yardımcı olabilirim?',
      isUser: false,
      timestamp: new Date(),
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);

  // Component mount debug
  useEffect(() => {
    console.log('🤖 AI Chat component mounted');
    
    // Setup periodic cleanup for expired messages
    cleanupRef.current = ChatMessageStorageService.setupPeriodicCleanup();
    
    return () => {
      // Cleanup on unmount
      if (cleanupRef.current) {
        cleanupRef.current();
      }
    };
  }, []);

  // Load user's full name when component mounts
  useEffect(() => {
    loadUserFullName();
  }, [user]);

  // Load persisted chat messages when user changes
  useEffect(() => {
    if (user?.id) {
      loadPersistedMessages();
    }
  }, [user]);

  // Auto-scroll to bottom when new messages are added
  useEffect(() => {
    const scrollToBottom = () => {
      if (scrollViewRef.current) {
        // Use setTimeout to ensure the message is rendered before scrolling
        setTimeout(() => {
          scrollViewRef.current?.scrollToEnd({ 
            animated: true 
          });
        }, 100);
      }
    };

    scrollToBottom();
  }, [messages]); // Trigger when messages array changes

  const loadPersistedMessages = async () => {
    if (!user?.id) return;

    try {
      console.log('📥 Loading persisted chat messages for user:', user.id);
      
      const { messages: storedMessages, error } = await ChatMessageStorageService.loadUserMessages(user.id);
      
      if (error) {
        console.warn('⚠️ Could not load persisted messages:', error);
        return;
      }

      if (storedMessages && storedMessages.length > 0) {
        // Convert stored messages to component format
        const convertedMessages: Message[] = storedMessages.map(msg => ({
          id: msg.id,
          text: msg.text,
          isUser: msg.isUser,
          timestamp: new Date(msg.timestamp)
        }));

        // Always keep the initial AI greeting, add persisted messages after it
        const initialMessage = messages[0];
        setMessages([initialMessage, ...convertedMessages]);
        
        console.log(`✅ Loaded ${convertedMessages.length} persisted messages`);
      }
    } catch (error) {
      console.error('❌ Error loading persisted messages:', error);
    }
  };

  const persistMessage = async (message: Message) => {
    if (!user?.id) return;

    try {
      const storedMessage: Omit<StoredChatMessage, 'timestamp'> = {
        id: message.id,
        text: message.text,
        isUser: message.isUser,
        user_id: user.id
      };

      await ChatMessageStorageService.addMessage(user.id, storedMessage);
    } catch (error) {
      console.warn('⚠️ Failed to persist message:', error);
    }
  };

  const loadUserFullName = async () => {
    if (!user?.id || !supabase) return;

    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('full_name, first_name, last_name')
        .eq('user_id', user.id)
        .single();

      if (data && !error) {
        // Try full_name first, if empty construct from first_name + last_name
        let fullName = data.full_name;
        if (!fullName && data.first_name && data.last_name) {
          fullName = `${data.first_name} ${data.last_name}`;
        }
        
        setUserFullName(fullName || '');
        console.log('👤 User full name loaded:', {
          full_name: data.full_name,
          first_name: data.first_name,
          last_name: data.last_name,
          final_name: fullName
        });
      } else if (error && error.code !== 'PGRST116') {
        console.warn('Failed to load user full name:', error);
      }
    } catch (error) {
      console.error('Error loading user full name:', error);
    }
  };

  const sendMessage = async () => {
    if (!inputText.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputText,
      isUser: true,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    
    // Persist user message
    await persistMessage(userMessage);
    
    setInputText('');
    setLoading(true);

    try {
      console.log('🤖 Sending user message to AI webhook:', inputText);
      
      // Send message to webhook
      const result = await WebhookService.sendAIChatMessage(
        inputText,
        user?.id,
        userFullName
      );
      
      console.log('🔄 AI webhook result:', result);
      
      let aiResponseText = '';
      
      if (result.success && result.response) {
        aiResponseText = result.response;
      } else {
        // Clean error message by removing prefix for user display
        let errorMessage = result.error || 
          'Üzgünüm, şu anda yanıt veremiyorum. Lütfen daha sonra tekrar deneyin.';
        
        // Remove "AI Webhook hatası: " prefix from error message for better UX
        if (errorMessage.startsWith('AI Webhook hatası: ')) {
          errorMessage = errorMessage.replace('AI Webhook hatası: ', '');
        }
        
        aiResponseText = errorMessage;
        console.error('❌ AI webhook failed:', errorMessage);
      }
      
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: aiResponseText,
        isUser: false,
        timestamp: new Date(),
      };
      
      setMessages(prev => [...prev, aiResponse]);
      
      // Persist AI response
      await persistMessage(aiResponse);
      
      console.log('✅ AI response added to messages');
      
    } catch (error) {
      console.error('❌ AI chat error:', error);
      
      const errorResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: 'Teknik bir sorun oluştu. Lütfen daha sonra tekrar deneyin.',
        isUser: false,
        timestamp: new Date(),
      };
      
      setMessages(prev => [...prev, errorResponse]);
      
      // Persist error response
      await persistMessage(errorResponse);
    } finally {
      setLoading(false);
    }
  };

  const clearChatHistory = async () => {
    if (!user?.id) return;

    Alert.alert(
      'Sohbet Geçmişini Temizle',
      'Tüm AI sohbet mesajlarınızı silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.',
      [
        { text: 'İptal', style: 'cancel' },
        {
          text: 'Temizle',
          style: 'destructive',
          onPress: async () => {
            try {
              console.log('🗑️ Clearing chat history for user:', user.id);
              
              // Clear from AsyncStorage
              const result = await ChatMessageStorageService.clearUserMessages(user.id);
              
              if (result.success) {
                // Reset UI state to initial message only
                const initialMessage: Message = {
                  id: '1',
                  text: 'Merhaba! Ben Astrocalc AI\'ım. Astroloji hakkında sorularınızı yanıtlamak için buradayım. Nasıl yardımcı olabilirim?',
                  isUser: false,
                  timestamp: new Date(),
                };
                
                setMessages([initialMessage]);
                
                Alert.alert('Başarılı', 'Sohbet geçmişiniz başarıyla temizlendi.');
                console.log('✅ Chat history cleared successfully');
              } else {
                Alert.alert('Hata', result.error || 'Sohbet geçmişi temizlenirken bir hata oluştu.');
                console.error('❌ Failed to clear chat history:', result.error);
              }
            } catch (error) {
              console.error('❌ Error clearing chat history:', error);
              Alert.alert('Hata', 'Beklenmeyen bir hata oluştu.');
            }
          }
        }
      ]
    );
  };

  return (
    <LinearGradient
      colors={['#1E1B4B', '#312E81', '#4C1D95']}
      style={styles.container}
    >
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <View style={styles.headerLeft}>
              <Sparkles size={24} color="#8B5CF6" />
              <Text style={styles.title}>Astrocalc AI</Text>
            </View>
            <TouchableOpacity 
              style={styles.clearButton}
              onPress={clearChatHistory}
            >
              <Trash2 size={20} color="#EF4444" />
            </TouchableOpacity>
          </View>
          <Text style={styles.subtitle}>Astroloji uzmanınız</Text>
        </View>

        <ScrollView 
          ref={scrollViewRef}
          style={styles.messagesContainer} 
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.messagesContent}
        >
          {messages.map((message) => (
            <View
              key={message.id}
              style={[
                styles.messageContainer,
                message.isUser ? styles.userMessage : styles.aiMessage
              ]}
            >
              <View style={styles.messageHeader}>
                {message.isUser ? (
                  <User size={16} color="#8B5CF6" />
                ) : (
                  <Bot size={16} color="#F59E0B" />
                )}
                <Text style={styles.messageTime}>
                  {message.timestamp.toLocaleTimeString('tr-TR', { 
                    hour: '2-digit', 
                    minute: '2-digit' 
                  })}
                </Text>
              </View>
              <Text style={styles.messageText}>{message.text}</Text>
            </View>
          ))}
          
          {loading && (
            <View style={[styles.messageContainer, styles.aiMessage]}>
              <View style={styles.messageHeader}>
                <Bot size={16} color="#F59E0B" />
                <Text style={styles.messageTime}>Yazıyor...</Text>
              </View>
              <Text style={styles.messageText}>...</Text>
            </View>
          )}
        </ScrollView>

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.textInput}
            value={inputText}
            onChangeText={setInputText}
            placeholder="Astroloji hakkında soru sorun..."
            placeholderTextColor="#64748B"
            multiline
            maxLength={500}
          />
          <TouchableOpacity
            style={[styles.sendButton, !inputText.trim() && styles.sendButtonDisabled]}
            onPress={sendMessage}
            disabled={!inputText.trim() || loading}
          >
            <Send size={20} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
  },
  header: {
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  title: {
    fontSize: 28,
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
  },
  clearButton: {
    padding: 8,
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.2)',
  },
  subtitle: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#CBD5E1',
  },
  messagesContainer: {
    flex: 1,
    paddingHorizontal: 20,
  },
  messagesContent: {
    paddingBottom: 10,
  },
  messageContainer: {
    marginBottom: 16,
    padding: 16,
    borderRadius: 16,
    maxWidth: '85%',
  },
  userMessage: {
    backgroundColor: 'rgba(139, 92, 246, 0.2)',
    alignSelf: 'flex-end',
    borderWidth: 1,
    borderColor: 'rgba(139, 92, 246, 0.3)',
  },
  aiMessage: {
    backgroundColor: 'rgba(30, 41, 59, 0.8)',
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderColor: '#334155',
  },
  messageHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  messageTime: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#94A3B8',
  },
  messageText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#E2E8F0',
    lineHeight: 20,
  },
  inputContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 20,
    gap: 12,
    alignItems: 'flex-end',
  },
  textInput: {
    flex: 1,
    backgroundColor: 'rgba(30, 41, 59, 0.8)',
    borderWidth: 1,
    borderColor: '#334155',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#FFFFFF',
    maxHeight: 100,
  },
  sendButton: {
    backgroundColor: '#8B5CF6',
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendButtonDisabled: {
    backgroundColor: '#64748B',
  },
});