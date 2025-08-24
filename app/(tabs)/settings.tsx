import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { User, Bell, Info, LogOut, ChevronRight, Shield, CircleHelp as HelpCircle, Star, Mail, MapPin, Trash2 } from 'lucide-react-native';
import { useAuth } from '../../hooks/useAuth';
import { useRouter } from 'expo-router';
import { supabase } from '../../lib/supabase';
import { useState, useEffect } from 'react';
import { ChatMessageStorageService } from '../../services/chatMessageStorage';

export default function SettingsScreen() {
  const { user, signOut } = useAuth();
  const router = useRouter();
  const [userProfile, setUserProfile] = useState<{full_name: string; first_name: string; last_name: string} | null>(null);
  const [loading, setLoading] = useState(true);
  const [chatStats, setChatStats] = useState<{
    totalMessages: number;
    expiredMessages: number;
    storageSizeKB: number;
  } | null>(null);

  useEffect(() => {
    loadUserProfile();
    loadChatStats();
  }, [user]);

  const loadUserProfile = async () => {
    if (!user?.id || !supabase) {
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('full_name, first_name, last_name')
        .eq('user_id', user.id)
        .single();

      if (data && !error) {
        setUserProfile(data);
      } else if (error && error.code !== 'PGRST116') {
        console.warn('Failed to load user profile:', error);
      }
    } catch (error) {
      console.error('Error loading user profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadChatStats = async () => {
    try {
      const stats = await ChatMessageStorageService.getStorageStats();
      setChatStats(stats);
    } catch (error) {
      console.error('Error loading chat stats:', error);
    }
  };

  const clearChatHistory = async () => {
    if (!user?.id) return;

    Alert.alert(
      'Sohbet Geçmişini Temizle',
      'AI sohbet geçmişinizi silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.',
      [
        { text: 'İptal', style: 'cancel' },
        {
          text: 'Temizle',
          style: 'destructive',
          onPress: async () => {
            try {
              const result = await ChatMessageStorageService.clearUserMessages(user.id);
              if (result.success) {
                Alert.alert('Başarılı', 'Sohbet geçmişiniz temizlendi.');
                loadChatStats(); // Refresh stats
              } else {
                Alert.alert('Hata', result.error || 'Temizleme işlemi başarısız.');
              }
            } catch (error) {
              Alert.alert('Hata', 'Beklenmeyen bir hata oluştu.');
            }
          }
        }
      ]
    );
  };

  const getDisplayName = () => {
    if (userProfile?.full_name) {
      return userProfile.full_name;
    } else if (userProfile?.first_name && userProfile?.last_name) {
      return `${userProfile.first_name} ${userProfile.last_name}`;
    } else if (userProfile?.first_name) {
      return userProfile.first_name;
    } else {
      return 'Kullanıcı';
    }
  };

  const handleLogout = async () => {
    Alert.alert(
      'Çıkış Yap',
      'Hesabınızdan çıkmak istediğinizden emin misiniz?',
      [
        { text: 'İptal', style: 'cancel' },
        { 
          text: 'Çıkış Yap', 
          style: 'destructive',
          onPress: async () => {
            try {
              const result = await signOut();
              
              // Handle both Supabase and demo mode
              if (result && result.error && !supabase) {
                // Demo mode - force logout
                console.log('Demo mode logout');
                router.replace('/welcome');
              } else if (result && result.error) {
                // Supabase error
                console.error('Supabase logout error:', result.error);
                Alert.alert('Hata', 'Çıkış yapılırken bir hata oluştu. Tekrar deneyin.');
              } else {
                // Success - navigation will be handled by auth state change
                console.log('Logout successful');
              }
            } catch (error) {
              console.error('Logout error:', error);
              // Force logout anyway for demo mode or critical errors
              Alert.alert(
                'Çıkış Yapılıyor',
                'Bağlantı hatası nedeniyle zorla çıkış yapılıyor.',
                [{ 
                  text: 'Tamam', 
                  onPress: () => router.replace('/welcome') 
                }]
              );
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
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>Ayarlar</Text>
          <Text style={styles.subtitle}>Hesap ve uygulama ayarları</Text>
        </View>

        {/* Profile Card */}
        <View style={styles.profileCard}>
          <View style={styles.profileAvatar}>
            <User size={32} color="#8B5CF6" />
          </View>
          <View style={styles.profileInfo}>
            <Text style={styles.profileName}>
              {loading ? 'Yükleniyor...' : getDisplayName()}
            </Text>
            <Text style={styles.profileEmail}>{user?.email || 'email@example.com'}</Text>
          </View>
        </View>

        {/* Settings Sections */}
        <View style={styles.settingsSection}>
          <Text style={styles.sectionHeader}>Hesap</Text>
          
          <TouchableOpacity 
            style={styles.settingItem}
            onPress={() => router.push('/profile-info')}
          >
            <View style={styles.settingLeft}>
              <User size={20} color="#8B5CF6" />
              <View style={styles.settingContent}>
                <Text style={styles.settingTitle}>Profil Bilgileri</Text>
                <Text style={styles.settingSubtitle}>Kişisel ve doğum bilgilerinizi görüntüleyin</Text>
              </View>
            </View>
            <ChevronRight size={20} color="#64748B" />
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.settingItem}
            onPress={() => router.push('/birth-info')}
          >
            <View style={styles.settingLeft}>
              <MapPin size={20} color="#F59E0B" />
              <View style={styles.settingContent}>
                <Text style={styles.settingTitle}>Doğum Bilgileri</Text>
                <Text style={styles.settingSubtitle}>Doğum haritası bilgilerinizi güncelleyin</Text>
              </View>
            </View>
            <ChevronRight size={20} color="#64748B" />
          </TouchableOpacity>
        </View>

        <View style={styles.settingsSection}>
          <Text style={styles.sectionHeader}>Uygulamalar</Text>
          
          <TouchableOpacity 
            style={styles.settingItem}
            onPress={() => router.push('/notification-settings')}
          >
            <View style={styles.settingLeft}>
              <Bell size={20} color="#F59E0B" />
              <View style={styles.settingContent}>
                <Text style={styles.settingTitle}>Bildirimler</Text>
                <Text style={styles.settingSubtitle}>Bildirim türleri ve zamanlaması</Text>
              </View>
            </View>
            <ChevronRight size={20} color="#64748B" />
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.settingItem}
            onPress={() => router.push('/privacy-policy')}
          >
            <View style={styles.settingLeft}>
              <Shield size={20} color="#10B981" />
              <View style={styles.settingContent}>
                <Text style={styles.settingTitle}>Gizlilik Politikası</Text>
                <Text style={styles.settingSubtitle}>Veri toplama ve kullanım politikaları</Text>
              </View>
            </View>
            <ChevronRight size={20} color="#64748B" />
          </TouchableOpacity>
        </View>

        <View style={styles.settingsSection}>
          <Text style={styles.sectionHeader}>AI Chat</Text>
          
          {chatStats && (
            <TouchableOpacity 
              style={styles.settingItem}
            >
              <View style={styles.settingLeft}>
                <HelpCircle size={20} color="#F59E0B" />
                <View style={styles.settingContent}>
                  <Text style={styles.settingTitle}>Sohbet İstatistikleri</Text>
                  <Text style={styles.settingSubtitle}>
                    {chatStats.totalMessages} mesaj, {chatStats.storageSizeKB} KB
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          )}

          <TouchableOpacity 
            style={styles.settingItem}
            onPress={clearChatHistory}
          >
            <View style={styles.settingLeft}>
              <Trash2 size={20} color="#EF4444" />
              <View style={styles.settingContent}>
                <Text style={styles.settingTitle}>Sohbet Geçmişini Temizle</Text>
                <Text style={styles.settingSubtitle}>Tüm AI sohbet mesajlarını sil (5 gün otomatik)</Text>
              </View>
            </View>
            <ChevronRight size={20} color="#64748B" />
          </TouchableOpacity>
        </View>

        <View style={styles.settingsSection}>
          <Text style={styles.sectionHeader}>Destek</Text>
          
          <TouchableOpacity 
            style={styles.settingItem}
          >
            <View style={styles.settingLeft}>
              <HelpCircle size={20} color="#3B82F6" />
              <View style={styles.settingContent}>
                <Text style={styles.settingTitle}>Yardım ve Destek</Text>
                <Text style={styles.settingSubtitle}>SSS, iletişim ve kullanım kılavuzu</Text>
              </View>
            </View>
            <ChevronRight size={20} color="#64748B" />
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.settingItem}
          >
            <View style={styles.settingLeft}>
              <Info size={20} color="#8B5CF6" />
              <View style={styles.settingContent}>
                <Text style={styles.settingTitle}>Hakkında</Text>
                <Text style={styles.settingSubtitle}>Uygulama bilgileri, sürüm ve lisanslar</Text>
              </View>
            </View>
            <ChevronRight size={20} color="#64748B" />
          </TouchableOpacity>
        </View>

        {/* Logout Button */}
        <TouchableOpacity 
          style={styles.logoutButton}
          onPress={handleLogout}
        >
          <LogOut size={20} color="#EF4444" />
          <Text style={styles.logoutText}>Çıkış Yap</Text>
        </TouchableOpacity>

        {/* Version Info */}
        <View style={styles.versionContainer}>
          <Text style={styles.versionText}>Astrocalc v1.0.0</Text>
          <Text style={styles.versionSubtext}>© 2025 Tüm hakları saklıdır</Text>
        </View>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  header: {
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  title: {
    fontSize: 28,
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#CBD5E1',
  },
  profileCard: {
    backgroundColor: 'rgba(139, 92, 246, 0.2)',
    marginHorizontal: 20,
    marginBottom: 24,
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(139, 92, 246, 0.3)',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  profileAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(139, 92, 246, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#8B5CF6',
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  profileEmail: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#CBD5E1',
  },
  settingsSection: {
    marginHorizontal: 20,
    marginBottom: 24,
  },
  sectionHeader: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#8B5CF6',
    marginBottom: 12,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  settingItem: {
    backgroundColor: 'rgba(30, 41, 59, 0.8)',
    padding: 20,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#334155',
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  settingContent: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  settingSubtitle: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#94A3B8',
  },
  logoutButton: {
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    marginHorizontal: 20,
    padding: 18,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.2)',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginBottom: 24,
  },
  logoutText: {
    fontSize: 18,
    fontFamily: 'Inter-Medium',
    color: '#EF4444',
  },
  versionContainer: {
    alignItems: 'center',
    paddingVertical: 32,
    paddingBottom: 40,
  },
  versionText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#94A3B8',
    marginBottom: 4,
  },
  versionSubtext: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#64748B'
  },
});