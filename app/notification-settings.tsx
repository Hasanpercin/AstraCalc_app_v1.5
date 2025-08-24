import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  Alert,
  Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { ArrowLeft, Bell, Volume2, Smartphone, Clock, CircleAlert as AlertCircle, Star } from 'lucide-react-native';
import * as Notifications from 'expo-notifications';

interface NotificationSetting {
  id: string;
  title: string;
  description: string;
  enabled: boolean;
  icon: React.ReactNode;
  type: 'system' | 'horoscope' | 'ai_chat' | 'birth_chart';
}

export default function NotificationSettingsScreen() {
  const router = useRouter();
  const [permissionGranted, setPermissionGranted] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [vibrationEnabled, setVibrationEnabled] = useState(true);
  const [quietHoursEnabled, setQuietHoursEnabled] = useState(false);
  const [notificationSettings, setNotificationSettings] = useState<NotificationSetting[]>([
    {
      id: 'daily_horoscope',
      title: 'Günlük Yorumlar',
      description: 'Her sabah 09:00\'da günlük astroloji yorumunuzu alın',
      enabled: true,
      icon: <Star size={20} color="#F59E0B" />,
      type: 'horoscope'
    },
    {
      id: 'ai_responses',
      title: 'AI Sohbet Yanıtları',
      description: 'Astrocalc AI\'dan gelen yanıtlar için bildirim',
      enabled: true,
      icon: <Bell size={20} color="#8B5CF6" />,
      type: 'ai_chat'
    },
    {
      id: 'birth_chart_updates',
      title: 'Doğum Haritası Güncellemeleri',
      description: 'Doğum haritanız güncellendiğinde bildirim alın',
      enabled: true,
      icon: <AlertCircle size={20} color="#10B981" />,
      type: 'birth_chart'
    },
    {
      id: 'system_notifications',
      title: 'Sistem Bildirimleri',
      description: 'Uygulama güncellemeleri ve önemli duyurular',
      enabled: false,
      icon: <Smartphone size={20} color="#3B82F6" />,
      type: 'system'
    },
  ]);

  useEffect(() => {
    checkNotificationPermissions();
  }, []);

  const checkNotificationPermissions = async () => {
    const { status } = await Notifications.getPermissionsAsync();
    setPermissionGranted(status === 'granted');
  };

  const requestNotificationPermissions = async () => {
    try {
      const { status } = await Notifications.requestPermissionsAsync();
      setPermissionGranted(status === 'granted');
      
      if (status === 'granted') {
        Alert.alert('Başarılı', 'Bildirim izinleri verildi.');
      } else {
        Alert.alert(
          'İzin Gerekli',
          'Bildirimler için cihaz ayarlarından izin vermeniz gerekiyor.',
          [
            { text: 'Tamam', style: 'default' },
            { text: 'Ayarlara Git', onPress: () => Notifications.openAppSettings() }
          ]
        );
      }
    } catch (error) {
      console.error('Notification permission error:', error);
      Alert.alert('Hata', 'Bildirim izinleri alınırken bir hata oluştu.');
    }
  };

  const toggleNotificationSetting = (id: string) => {
    setNotificationSettings(prev =>
      prev.map(setting =>
        setting.id === id
          ? { ...setting, enabled: !setting.enabled }
          : setting
      )
    );
  };

  const scheduleTestNotification = async () => {
    if (!permissionGranted) {
      Alert.alert('İzin Gerekli', 'Test bildirim göndermek için önce izin vermeniz gerekiyor.');
      return;
    }

    try {
      await Notifications.scheduleNotificationAsync({
        content: {
          title: 'Test Bildirimi',
          body: 'Bu bir test bildirimidir. Bildirimleriniz düzgün çalışıyor!',
          sound: soundEnabled,
        },
        trigger: { seconds: 1 },
      });
      
      Alert.alert('Test Gönderildi', 'Birkaç saniye içinde test bildirimi alacaksınız.');
    } catch (error) {
      console.error('Test notification error:', error);
      Alert.alert('Hata', 'Test bildirimi gönderilirken bir hata oluştu.');
    }
  };

  return (
    <LinearGradient
      colors={['#1E1B4B', '#312E81', '#4C1D95']}
      style={styles.container}
    >
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <ArrowLeft size={24} color="#FFFFFF" />
          </TouchableOpacity>
          <View style={styles.headerCenter}>
            <Text style={styles.headerTitle}>Bildirim Ayarları</Text>
            <Text style={styles.headerSubtitle}>Bildirim tercihlerinizi yönetin</Text>
          </View>
        </View>

        {/* Permission Status */}
        <View style={[
          styles.permissionCard,
          permissionGranted ? styles.permissionGranted : styles.permissionDenied
        ]}>
          <View style={styles.permissionInfo}>
            <Bell size={24} color={permissionGranted ? "#10B981" : "#F59E0B"} />
            <View style={styles.permissionText}>
              <Text style={styles.permissionTitle}>
                Bildirim İzni {permissionGranted ? 'Verildi' : 'Gerekli'}
              </Text>
              <Text style={styles.permissionDescription}>
                {permissionGranted 
                  ? 'Bildirimler aktif durumda'
                  : 'Bildirimleri etkinleştirmek için izin verin'
                }
              </Text>
            </View>
          </View>
          {!permissionGranted && (
            <TouchableOpacity 
              style={styles.permissionButton}
              onPress={requestNotificationPermissions}
            >
              <Text style={styles.permissionButtonText}>İzin Ver</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Global Settings */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Genel Ayarlar</Text>
          
          <View style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <Volume2 size={20} color="#F59E0B" />
              <View style={styles.settingContent}>
                <Text style={styles.settingTitle}>Bildirim Sesi</Text>
                <Text style={styles.settingDescription}>Bildirim geldiğinde ses çal</Text>
              </View>
            </View>
            <Switch
              value={soundEnabled}
              onValueChange={setSoundEnabled}
              trackColor={{ false: '#374151', true: '#8B5CF6' }}
              thumbColor={soundEnabled ? '#FFFFFF' : '#94A3B8'}
            />
          </View>

          <View style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <Smartphone size={20} color="#8B5CF6" />
              <View style={styles.settingContent}>
                <Text style={styles.settingTitle}>Titreşim</Text>
                <Text style={styles.settingDescription}>Bildirim geldiğinde telefonu titrет</Text>
              </View>
            </View>
            <Switch
              value={vibrationEnabled}
              onValueChange={setVibrationEnabled}
              trackColor={{ false: '#374151', true: '#8B5CF6' }}
              thumbColor={vibrationEnabled ? '#FFFFFF' : '#94A3B8'}
            />
          </View>

          <View style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <Clock size={20} color="#10B981" />
              <View style={styles.settingContent}>
                <Text style={styles.settingTitle}>Sessiz Saatler</Text>
                <Text style={styles.settingDescription}>22:00 - 08:00 arası bildirimleri kapat</Text>
              </View>
            </View>
            <Switch
              value={quietHoursEnabled}
              onValueChange={setQuietHoursEnabled}
              trackColor={{ false: '#374151', true: '#8B5CF6' }}
              thumbColor={quietHoursEnabled ? '#FFFFFF' : '#94A3B8'}
            />
          </View>
        </View>

        {/* Notification Types */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Bildirim Türleri</Text>
          
          {notificationSettings.map((setting) => (
            <View key={setting.id} style={styles.settingItem}>
              <View style={styles.settingLeft}>
                {setting.icon}
                <View style={styles.settingContent}>
                  <Text style={styles.settingTitle}>{setting.title}</Text>
                  <Text style={styles.settingDescription}>{setting.description}</Text>
                </View>
              </View>
              <Switch
                value={setting.enabled}
                onValueChange={() => toggleNotificationSetting(setting.id)}
                trackColor={{ false: '#374151', true: '#8B5CF6' }}
                thumbColor={setting.enabled ? '#FFFFFF' : '#94A3B8'}
              />
            </View>
          ))}
        </View>

        {/* Test Notification */}
        <View style={styles.section}>
          <TouchableOpacity 
            style={styles.testButton}
            onPress={scheduleTestNotification}
          >
            <Bell size={20} color="#FFFFFF" />
            <Text style={styles.testButtonText}>Test Bildirimi Gönder</Text>
          </TouchableOpacity>
        </View>

        {/* Info */}
        <View style={styles.infoSection}>
          <Text style={styles.infoTitle}>ℹ️ Bilgi</Text>
          <Text style={styles.infoText}>
            Bildirim ayarlarınızı değiştirdikten sonra değişiklikler hemen etkili olur. 
            Cihazınızın sistem ayarlarından da bildirim kontrolü yapabilirsiniz.
          </Text>
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
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  backButton: {
    padding: 8,
  },
  headerCenter: {
    flex: 1,
    alignItems: 'center',
    marginHorizontal: 16,
  },
  headerTitle: {
    fontSize: 20,
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF',
  },
  headerSubtitle: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#CBD5E1',
    marginTop: 2,
  },
  permissionCard: {
    marginHorizontal: 20,
    marginBottom: 24,
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
  },
  permissionGranted: {
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    borderColor: 'rgba(16, 185, 129, 0.3)',
  },
  permissionDenied: {
    backgroundColor: 'rgba(245, 158, 11, 0.1)',
    borderColor: 'rgba(245, 158, 11, 0.3)',
  },
  permissionInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    marginBottom: 16,
  },
  permissionText: {
    flex: 1,
  },
  permissionTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  permissionDescription: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#CBD5E1',
  },
  permissionButton: {
    backgroundColor: '#8B5CF6',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  permissionButtonText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF',
  },
  section: {
    marginHorizontal: 20,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF',
    marginBottom: 16,
  },
  settingItem: {
    backgroundColor: 'rgba(30, 41, 59, 0.8)',
    padding: 20,
    borderRadius: 16,
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
  settingDescription: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#94A3B8',
  },
  testButton: {
    backgroundColor: '#8B5CF6',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    shadowColor: '#8B5CF6',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 8,
  },
  testButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF',
  },
  infoSection: {
    backgroundColor: 'rgba(59, 130, 246, 0.1)',
    marginHorizontal: 20,
    marginBottom: 40,
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(59, 130, 246, 0.2)',
  },
  infoTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#93C5FD',
    marginBottom: 8,
  },
  infoText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#BFDBFE',
    lineHeight: 20,
  },
});