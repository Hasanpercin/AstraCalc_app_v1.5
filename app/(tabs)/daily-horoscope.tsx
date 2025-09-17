import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  RefreshControl,
  Alert 
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Calendar, Sun, RefreshCw, Clock } from 'lucide-react-native';
import { useAuth } from '../../hooks/useAuth';
import { DailyHoroscopeService } from '../../services/dailyHoroscope';

interface DailyHoroscope {
  id: string;
  comment: string;
  horoscope_date: string;
  created_at: string;
  updated_at: string;
}

export default function DailyHoroscopeScreen() {
  const { user } = useAuth();
  const [horoscope, setHoroscope] = useState<DailyHoroscope | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  useEffect(() => {
    loadTodaysHoroscope();
  }, [user]);

  useEffect(() => {
    // Set up daily auto-refresh at 09:00 AM
    const setupDailyRefresh = () => {
      const now = new Date();
      const tomorrow = new Date(now);
      tomorrow.setDate(tomorrow.getDate() + 1);
      tomorrow.setHours(9, 0, 0, 0); // 09:00 AM

      const timeUntilTomorrow = tomorrow.getTime() - now.getTime();

      // Set initial timeout for next 09:00 AM
      const timeoutId = setTimeout(() => {
        loadTodaysHoroscope(true);
        
        // Then set up daily interval
        const intervalId = setInterval(() => {
          loadTodaysHoroscope(true);
        }, 24 * 60 * 60 * 1000); // 24 hours

        return () => clearInterval(intervalId);
      }, timeUntilTomorrow);

      return () => clearTimeout(timeoutId);
    };

    const cleanup = setupDailyRefresh();
    return cleanup;
  }, []);

  const loadTodaysHoroscope = async (isAutoRefresh: boolean = false) => {
    if (!user?.id) {
      setLoading(false);
      return;
    }

    try {
      if (!isAutoRefresh) {
        setLoading(true);
      }

      const result = await DailyHoroscopeService.getTodaysHoroscope(user.id);
      
      if (result.horoscope) {
        setHoroscope(result.horoscope);
        setLastUpdated(new Date());
      } else if (result.error) {
        console.error('Failed to load horoscope:', result.error);
        
        // Try to generate a new horoscope if none exists
        const generateResult = await DailyHoroscopeService.generateTodaysHoroscope(user.id);
        if (generateResult.success && generateResult.horoscope) {
          setHoroscope(generateResult.horoscope);
          setLastUpdated(new Date());
        } else {
          // Show fallback message
          setHoroscope({
            id: 'fallback',
            comment: 'Bugün için özel bir mesajınız hazırlanıyor. Lütfen daha sonra tekrar kontrol edin.',
            horoscope_date: new Date().toISOString().split('T')[0],
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          });
        }
      }
    } catch (error) {
      console.error('Error loading horoscope:', error);
      Alert.alert('Hata', 'Günlük yorumunuz yüklenirken bir hata oluştu.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadTodaysHoroscope();
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('tr-TR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('tr-TR', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <LinearGradient
        colors={['#1E1B4B', '#312E81', '#4C1D95']}
        style={styles.container}
      >
        <View style={styles.loadingContainer}>
          <Sun size={48} color="#F59E0B" />
          <Text style={styles.loadingText}>Günlük yorumunuz hazırlanıyor...</Text>
        </View>
      </LinearGradient>
    );
  }

  return (
    <LinearGradient
      colors={['#1E1B4B', '#312E81', '#4C1D95']}
      style={styles.container}
    >
      <ScrollView 
        style={styles.scrollView} 
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#8B5CF6"
            colors={['#8B5CF6']}
          />
        }
      >
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <Sun size={32} color="#F59E0B" />
            <Text style={styles.title}>Günlük Yorum</Text>
          </View>
          <Text style={styles.subtitle}>Bugünün özel mesajınız</Text>
        </View>

        {/* Date Card */}
        <View style={styles.dateCard}>
          <Calendar size={20} color="#8B5CF6" />
          <Text style={styles.dateText}>
            {horoscope ? formatDate(horoscope.horoscope_date) : formatDate(new Date().toISOString())}
          </Text>
        </View>

        {/* Horoscope Content */}
        {horoscope ? (
          <View style={styles.horoscopeCard}>
            <View style={styles.horoscopeHeader}>
              <Text style={styles.horoscopeTitle}>Bugünün Mesajı</Text>
              {lastUpdated && (
                <View style={styles.updateInfo}>
                  <Clock size={14} color="#94A3B8" />
                  <Text style={styles.updateTime}>
                    {formatTime(lastUpdated.toISOString())}
                  </Text>
                </View>
              )}
            </View>
            
            <ScrollView 
              style={styles.commentScrollView}
              showsVerticalScrollIndicator={true}
              nestedScrollEnabled={true}
            >
              <Text style={styles.horoscopeComment}>
                {horoscope.comment}
              </Text>
            </ScrollView>
          </View>
        ) : (
          <View style={styles.noHoroscopeCard}>
            <Sun size={48} color="#64748B" />
            <Text style={styles.noHoroscopeTitle}>Henüz Yorum Yok</Text>
            <Text style={styles.noHoroscopeText}>
              Bugün için özel yorumunuz henüz hazır değil. Lütfen daha sonra tekrar kontrol edin.
            </Text>
            <TouchableOpacity 
              style={styles.refreshButton}
              onPress={() => loadTodaysHoroscope()}
            >
              <RefreshCw size={16} color="#FFFFFF" />
              <Text style={styles.refreshButtonText}>Yenile</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Info Section */}
        <View style={styles.infoSection}>
          <Text style={styles.infoTitle}>📅 Otomatik Güncelleme</Text>
          <Text style={styles.infoText}>
            Günlük yorumlarınız her gün saat 09:00'da otomatik olarak güncellenir. 
            Sayfayı aşağı kaydırarak manuel olarak da yenileyebilirsiniz.
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  loadingText: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#CBD5E1',
    textAlign: 'center',
    marginTop: 16,
  },
  header: {
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 4,
  },
  title: {
    fontSize: 28,
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
  },
  subtitle: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#CBD5E1',
  },
  dateCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: 'rgba(139, 92, 246, 0.2)',
    marginHorizontal: 20,
    marginBottom: 24,
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(139, 92, 246, 0.3)',
  },
  dateText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF',
  },
  horoscopeCard: {
    backgroundColor: 'rgba(30, 41, 59, 0.8)',
    marginHorizontal: 20,
    marginBottom: 24,
    padding: 24,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#334155',
  },
  horoscopeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  horoscopeTitle: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
  },
  updateInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  updateTime: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#94A3B8',
  },
  commentScrollView: {
    maxHeight: 400,
  },
  horoscopeComment: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#E2E8F0',
    lineHeight: 26,
    textAlign: 'left',
  },
  noHoroscopeCard: {
    backgroundColor: 'rgba(30, 41, 59, 0.8)',
    marginHorizontal: 20,
    marginBottom: 24,
    padding: 40,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#334155',
    alignItems: 'center',
  },
  noHoroscopeTitle: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
    marginTop: 16,
    marginBottom: 12,
    textAlign: 'center',
  },
  noHoroscopeText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#94A3B8',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 24,
  },
  refreshButton: {
    backgroundColor: '#8B5CF6',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  refreshButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
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