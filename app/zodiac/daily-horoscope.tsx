import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  ScrollView, 
  StyleSheet, 
  SafeAreaView,
  ActivityIndicator,
  Alert,
  TouchableOpacity,
  Dimensions
} from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { ZodiacService } from '@/services/zodiacService';
import { DailyHoroscope } from '@/types/zodiac';

const { width } = Dimensions.get('window');

type HoroscopeCategory = 'general' | 'love' | 'career' | 'health';

interface TabData {
  key: HoroscopeCategory;
  title: string;
  icon: string;
}

const TABS: TabData[] = [
  { key: 'general', title: 'Genel', icon: '🌟' },
  { key: 'love', title: 'Aşk', icon: '❤️' },
  { key: 'career', title: 'Kariyer', icon: '💼' },
  { key: 'health', title: 'Sağlık', icon: '🏥' },
];

export default function DailyHoroscopeScreen() {
  const { signId, signName } = useLocalSearchParams<{ signId: string; signName: string }>();
  const [horoscope, setHoroscope] = useState<DailyHoroscope | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<HoroscopeCategory>('general');
  const [selectedDate, setSelectedDate] = useState(new Date());

  useEffect(() => {
    if (signId) {
      loadHoroscope(parseInt(signId), ZodiacService.formatDate(selectedDate));
    }
  }, [signId, selectedDate]);

  const loadHoroscope = async (id: number, date: string) => {
    try {
      setLoading(true);
      const { data, error } = await ZodiacService.getDailyHoroscope(id, date);
      
      if (error) {
        Alert.alert('Hata', error);
        return;
      }

      setHoroscope(data);
    } catch (error) {
      console.error('Error loading horoscope:', error);
      Alert.alert('Hata', 'Günlük yorum yüklenirken bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  const getTabContent = (category: HoroscopeCategory): string => {
    if (!horoscope) return 'Günlük yorum bulunamadı.';
    
    switch (category) {
      case 'general':
        return horoscope.general_overview || 'Genel yorum mevcut değil.';
      case 'love':
        return horoscope.love_commentary || 'Aşk yorumu mevcut değil.';
      case 'career':
        return horoscope.career_commentary || 'Kariyer yorumu mevcut değil.';
      case 'health':
        return horoscope.health_commentary || 'Sağlık yorumu mevcut değil.';
      default:
        return 'İçerik bulunamadı.';
    }
  };

  const formatDate = (date: Date): string => {
    return date.toLocaleDateString('tr-TR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const navigateDateArrow = (direction: 'prev' | 'next') => {
    const newDate = new Date(selectedDate);
    if (direction === 'prev') {
      newDate.setDate(newDate.getDate() - 1);
    } else {
      newDate.setDate(newDate.getDate() + 1);
    }
    setSelectedDate(newDate);
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color="#6366f1" />
          <Text style={styles.loadingText}>Günlük yorum yükleniyor...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header with Date Navigation */}
      <View style={styles.header}>
        <Text style={styles.signName}>{signName} Burcu</Text>
        <View style={styles.dateNavigation}>
          <TouchableOpacity 
            style={styles.dateArrow}
            onPress={() => navigateDateArrow('prev')}
          >
            <Text style={styles.arrowText}>‹</Text>
          </TouchableOpacity>
          
          <Text style={styles.dateText}>{formatDate(selectedDate)}</Text>
          
          <TouchableOpacity 
            style={styles.dateArrow}
            onPress={() => navigateDateArrow('next')}
          >
            <Text style={styles.arrowText}>›</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Tab Navigation */}
      <View style={styles.tabContainer}>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.tabScrollContent}
        >
          {TABS.map((tab) => (
            <TouchableOpacity
              key={tab.key}
              style={[
                styles.tab,
                activeTab === tab.key && styles.activeTab
              ]}
              onPress={() => setActiveTab(tab.key)}
              activeOpacity={0.8}
            >
              <Text style={styles.tabIcon}>{tab.icon}</Text>
              <Text style={[
                styles.tabText,
                activeTab === tab.key && styles.activeTabText
              ]}>
                {tab.title}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Content */}
      <ScrollView style={styles.contentContainer} showsVerticalScrollIndicator={false}>
        <View style={styles.contentCard}>
          <Text style={styles.contentText}>
            {getTabContent(activeTab)}
          </Text>
        </View>

        {!horoscope && (
          <View style={styles.noDataCard}>
            <Text style={styles.noDataText}>
              Bu tarih için henüz yorum eklenmemiş.
            </Text>
            <Text style={styles.noDataSubtext}>
              Lütfen başka bir tarih seçmeyi deneyin.
            </Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0a0a',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: '#fff',
    fontSize: 16,
    marginTop: 16,
  },
  header: {
    padding: 20,
    paddingBottom: 0,
  },
  signName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 16,
  },
  dateNavigation: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: '#2a2a2a',
  },
  dateArrow: {
    padding: 8,
    paddingHorizontal: 12,
  },
  arrowText: {
    color: '#6366f1',
    fontSize: 20,
    fontWeight: 'bold',
  },
  dateText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
    flex: 1,
    textAlign: 'center',
    marginHorizontal: 16,
  },
  tabContainer: {
    marginTop: 16,
  },
  tabScrollContent: {
    paddingHorizontal: 16,
  },
  tab: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1a1a1a',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 25,
    marginRight: 12,
    borderWidth: 1,
    borderColor: '#2a2a2a',
  },
  activeTab: {
    backgroundColor: '#6366f1',
    borderColor: '#6366f1',
  },
  tabIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  tabText: {
    color: '#a1a1aa',
    fontSize: 14,
    fontWeight: '500',
  },
  activeTabText: {
    color: '#fff',
  },
  contentContainer: {
    flex: 1,
    padding: 16,
  },
  contentCard: {
    backgroundColor: '#1a1a1a',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: '#2a2a2a',
  },
  contentText: {
    color: '#d4d4d8',
    fontSize: 16,
    lineHeight: 24,
  },
  noDataCard: {
    backgroundColor: '#1a1a1a',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: '#2a2a2a',
    alignItems: 'center',
    marginTop: 16,
  },
  noDataText: {
    color: '#a1a1aa',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 8,
  },
  noDataSubtext: {
    color: '#71717a',
    fontSize: 14,
    textAlign: 'center',
  },
});
