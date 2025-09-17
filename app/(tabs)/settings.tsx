import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { 
  User, 
  Settings as SettingsIcon, 
  Bell, 
  MessageSquare, 
  FileText, 
  HelpCircle, 
  Info, 
  LogOut,
  ChevronRight,
  BarChart3,
  Trash2
} from 'lucide-react-native';
import { useAuth } from '../../hooks/useAuth';
import { ChatMessageStorageService } from '../../services/chatMessageStorage';

interface SettingsSection {
  title: string;
  items: SettingsItem[];
}

interface SettingsItem {
  icon: React.ComponentType<any>;
  title: string;
  subtitle?: string;
  route?: string;
  action?: () => void;
  showChevron?: boolean;
}

export default function SettingsScreen() {
  const router = useRouter();
  const { user, signOut } = useAuth();
  const [chatHistory, setChatHistory] = useState<any[]>([]);

  useEffect(() => {
    loadChatHistory();
  }, []);

  const loadChatHistory = async () => {
    try {
      if (user?.id) {
        const { messages } = await ChatMessageStorageService.loadUserMessages(user.id);
        setChatHistory(messages || []);
      }
    } catch (error) {
      console.error('Chat geçmişi yüklenirken hata:', error);
    }
  };

  const handleClearChatHistory = () => {
    Alert.alert(
      'Chat Geçmişini Temizle',
      'Tüm chat geçmişiniz silinecek. Bu işlem geri alınamaz.',
      [
        {
          text: 'İptal',
          style: 'cancel',
        },
        {
          text: 'Temizle',
          style: 'destructive',
          onPress: async () => {
            try {
              if (user?.id) {
                await ChatMessageStorageService.clearUserMessages(user.id);
                setChatHistory([]);
                Alert.alert('Başarılı', 'Chat geçmişi temizlendi.');
              }
            } catch (error) {
              Alert.alert('Hata', 'Chat geçmişi temizlenirken bir hata oluştu.');
            }
          },
        },
      ]
    );
  };

  const handleLogout = () => {
    Alert.alert(
      'Çıkış Yap',
      'Hesabınızdan çıkış yapmak istediğinizden emin misiniz?',
      [
        {
          text: 'İptal',
          style: 'cancel',
        },
        {
          text: 'Çıkış Yap',
          style: 'destructive',
          onPress: signOut,
        },
      ]
    );
  };

  const settingsSections: SettingsSection[] = [
    {
      title: 'Hesap',
      items: [
        {
          icon: User,
          title: 'Profil Bilgileri',
          subtitle: 'Kişisel bilgilerinizi düzenleyin',
          route: '/profile-info',
          showChevron: true,
        },
        {
          icon: SettingsIcon,
          title: 'Doğum Bilgileri',
          subtitle: 'Doğum tarihi ve saat bilgilerinizi düzenleyin',
          route: '/birth-info',
          showChevron: true,
        },
      ],
    },
    {
      title: 'Uygulamalar',
      items: [
        {
          icon: Bell,
          title: 'Bildirim Ayarları',
          subtitle: 'Bildirim tercihlerinizi yönetin',
          route: '/notification-settings',
          showChevron: true,
        },
        {
          icon: FileText,
          title: 'Gizlilik Politikası',
          subtitle: 'Gizlilik politikamızı inceleyin',
          route: '/privacy-policy',
          showChevron: true,
        },
      ],
    },
    {
      title: 'AI Chat',
      items: [
        {
          icon: BarChart3,
          title: 'Chat İstatistikleri',
          subtitle: `${chatHistory.length} mesaj geçmişi`,
          showChevron: false,
        },
        {
          icon: Trash2,
          title: 'Geçmişi Temizle',
          subtitle: 'Tüm chat geçmişini sil',
          action: handleClearChatHistory,
          showChevron: false,
        },
      ],
    },
    {
      title: 'Destek',
      items: [
        {
          icon: HelpCircle,
          title: 'Yardım & Destek',
          subtitle: 'SSS ve destek merkezi',
          showChevron: true,
        },
        {
          icon: Info,
          title: 'Hakkında',
          subtitle: 'Uygulama versiyonu ve bilgileri',
          showChevron: true,
        },
      ],
    },
  ];

  const renderSettingsItem = (item: SettingsItem, index: number) => (
    <TouchableOpacity
      key={index}
      style={styles.settingsItem}
      onPress={() => {
        if (item.action) {
          item.action();
        } else if (item.route) {
          router.push(item.route as any);
        }
      }}
    >
      <View style={styles.settingsItemLeft}>
        <View style={styles.iconContainer}>
          <item.icon size={20} color="#FFFFFF" />
        </View>
        <View style={styles.textContainer}>
          <Text style={styles.settingsItemTitle}>{item.title}</Text>
          {item.subtitle && (
            <Text style={styles.settingsItemSubtitle}>{item.subtitle}</Text>
          )}
        </View>
      </View>
      {item.showChevron && (
        <ChevronRight size={20} color="#666" />
      )}
    </TouchableOpacity>
  );

  const renderSettingsSection = (section: SettingsSection, index: number) => (
    <View key={index} style={styles.section}>
      <Text style={styles.sectionTitle}>{section.title}</Text>
      <View style={styles.sectionContent}>
        {section.items.map((item, itemIndex) => renderSettingsItem(item, itemIndex))}
      </View>
    </View>
  );

  return (
    <LinearGradient colors={['#0F0F23', '#1A1A3A']} style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Kullanıcı Profil Kartı */}
        <View style={styles.profileCard}>
          <View style={styles.avatarContainer}>
            <View style={styles.avatarPlaceholder}>
              <User size={40} color="#FFFFFF" />
            </View>
          </View>
          <View style={styles.userInfo}>
            <Text style={styles.userName}>
              {user?.email?.split('@')[0] || 'Kullanıcı'}
            </Text>
            <Text style={styles.userEmail}>{user?.email || 'user@example.com'}</Text>
          </View>
        </View>

        {/* Ayarlar Bölümleri */}
        {settingsSections.map((section, index) => renderSettingsSection(section, index))}

        {/* Çıkış Yap Butonu */}
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <LogOut size={20} color="#FF6B6B" />
          <Text style={styles.logoutText}>Çıkış Yap</Text>
        </TouchableOpacity>

        <View style={styles.bottomSpacer} />
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
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 16,
    padding: 20,
    margin: 20,
    marginTop: 60,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  avatarContainer: {
    marginRight: 16,
  },
  avatarPlaceholder: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(165, 163, 255, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
    color: '#A5A3FF',
  },
  section: {
    marginHorizontal: 20,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#A5A3FF',
    marginBottom: 12,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  sectionContent: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  settingsItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  settingsItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(165, 163, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  textContainer: {
    flex: 1,
  },
  settingsItemTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#FFFFFF',
    marginBottom: 2,
  },
  settingsItemSubtitle: {
    fontSize: 14,
    color: '#A5A3FF',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 107, 107, 0.1)',
    borderRadius: 16,
    padding: 16,
    margin: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 107, 107, 0.3)',
  },
  logoutText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FF6B6B',
    marginLeft: 8,
  },
  bottomSpacer: {
    height: 100,
  },
});