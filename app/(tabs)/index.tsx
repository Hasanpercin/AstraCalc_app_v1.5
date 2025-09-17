import React from 'react';
import { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { Star, TrendingUp, Calendar, Plus, Sun, RefreshCw } from 'lucide-react-native';
import { useAuth } from '../../hooks/useAuth';
import { AstrologyDataService } from '../../services/astrologyDataService';
import { DailyHoroscopeService } from '../../services/dailyHoroscope';
import { supabase } from '../../lib/supabase';

interface DailyHoroscope {
  id: string;
  user_id: string;
  comment: string;
  horoscope_date: string;
  meta: string;
  created_at: string;
  updated_at: string;
}

export default function HomeScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const refreshIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const [userFullName, setUserFullName] = useState<string>('');
  const [hasExistingChart, setHasExistingChart] = useState(false);
  const [todaysHoroscope, setTodaysHoroscope] = useState<DailyHoroscope | null>(null);
  const [horoscopeLoading, setHoroscopeLoading] = useState(true);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkExistingChart();
    loadTodaysHoroscope();
    loadUserName();
    setupDailyRefresh();
    
    return () => {
      if (refreshIntervalRef.current) {
        clearInterval(refreshIntervalRef.current);
      }
    };
  }, [user]);

  const checkExistingChart = async () => {
    if (!user?.id) {
      console.log('👥 No authenticated user on home screen');
      setLoading(false);
      return;
    }

    try {
      console.log('🔍 Checking for existing chart for user:', user.id);
      const astrologyData = await AstrologyDataService.getUserAstrologyInterpretation(user.id);
      setHasExistingChart(!!astrologyData);
      console.log('📊 Has existing chart:', !!astrologyData);
    } catch (error) {
      console.error('❌ Error checking existing chart:', error);
      setHasExistingChart(false);
    } finally {
      setLoading(false);
    }
  };

  const loadUserName = async () => {
    if (!user?.id || !supabase) {
      return;
    }

    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('full_name, first_name, last_name')
        .eq('user_id', user.id)
        .single();

      if (data && !error) {
        setUserFullName(data.full_name || `${data.first_name} ${data.last_name}`.trim());
      }
    } catch (error) {
      console.error('Error loading user name:', error);
    }
  };

  const loadTodaysHoroscope = async (forceRefresh: boolean = false) => {
    if (!user?.id) return;

    try {
      setHoroscopeLoading(true);
      console.log('🌟 Loading today\'s horoscope, forceRefresh:', forceRefresh);
      
      const result = await DailyHoroscopeService.getTodaysHoroscope(user.id);
      setTodaysHoroscope(result.horoscope);
      console.log('✨ Today\'s horoscope loaded:', !!result.horoscope);
    } catch (error) {
      console.error('❌ Error loading today\'s horoscope:', error);
      setTodaysHoroscope(null);
    } finally {
      setHoroscopeLoading(false);
    }
  };

  const setupDailyRefresh = () => {
    // Refresh horoscope every 4 hours
    const intervalId = setInterval(() => {
      console.log('⏰ Auto-refreshing horoscope...');
      loadTodaysHoroscope(true);
    }, 4 * 60 * 60 * 1000);

    refreshIntervalRef.current = intervalId as any;
  };

  const formatHoroscopeDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('tr-TR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  return (
    <LinearGradient
      colors={['#1E1B4B', '#312E81', '#4C1D95']}
      style={styles.container}
    >
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <Star size={28} color="#8B5CF6" />
            <Text style={styles.title}>Astrocalc</Text>
          </View>
          <Text style={styles.subtitle}>Kişisel astroloji rehberiniz</Text>
        </View>

        <View style={styles.welcomeCard}>
          <Text style={styles.welcomeTitle}>
            {userFullName ? `Hoş geldiniz ${userFullName}!` : 'Hoş geldiniz!'}
          </Text>
          <Text style={styles.welcomeSubtitle}>
            Astroloji yolculuğunuza başlamaya hazır mısınız?
          </Text>
        </View>

        {/* Quick Actions */}
        <View style={styles.quickActions}>
          {!loading && (
            <TouchableOpacity 
              style={styles.actionCard}
              onPress={() => {
                console.log('Birth chart action pressed, hasExistingChart:', hasExistingChart);
                if (hasExistingChart) {
                  router.push('/(tabs)/birth-chart');
                } else {
                  router.push('/birth-form');
                }
              }}
            >
              {hasExistingChart ? (
                <>
                  <Star size={24} color="#8B5CF6" />
                  <Text style={styles.actionTitle}>Doğum Haritası</Text>
                  <Text style={styles.actionSubtitle}>Görüntüle</Text>
                </>
              ) : (
                <>
                  <Plus size={24} color="#8B5CF6" />
                  <Text style={styles.actionTitle}>Doğum Haritası</Text>
                  <Text style={styles.actionSubtitle}>Oluştur</Text>
                </>
              )}
            </TouchableOpacity>
          )}
          
          <TouchableOpacity 
            style={styles.actionCard}
            onPress={() => router.push('/(tabs)/daily-horoscope')}
          >
            <Sun size={24} color="#F59E0B" />
            <Text style={styles.actionTitle}>Günlük Yorum</Text>
            <Text style={styles.actionSubtitle}>Bugünün mesajı</Text>
          </TouchableOpacity>
        </View>

        {/* Daily Comment Window */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Günlük Yorum</Text>
          
          {horoscopeLoading ? (
            <View style={styles.horoscopeLoadingCard}>
              <Sun size={32} color="#F59E0B" />
              <Text style={styles.horoscopeLoadingText}>Günlük yorumunuz hazırlanıyor...</Text>
            </View>
          ) : todaysHoroscope ? (
            <TouchableOpacity 
              style={styles.horoscopeCard}
              onPress={() => router.push('/(tabs)/daily-horoscope')}
            >
              <View style={styles.horoscopeHeader}>
                <Calendar size={20} color="#F59E0B" />
                <Text style={styles.horoscopeDate}>
                  {formatHoroscopeDate(todaysHoroscope.horoscope_date)}
                </Text>
                <TouchableOpacity 
                  style={styles.refreshButton}
                  onPress={(e) => {
                    e.stopPropagation();
                    loadTodaysHoroscope(true);
                  }}
                >
                  <RefreshCw size={16} color="#8B5CF6" />
                </TouchableOpacity>
              </View>
              <Text style={styles.horoscopeText} numberOfLines={3} ellipsizeMode="tail">
                {todaysHoroscope.comment}
              </Text>
              <Text style={styles.horoscopeReadMore}>Devamını okumak için dokunun →</Text>
            </TouchableOpacity>
          ) : (
            <View style={styles.horoscopeEmptyCard}>
              <Sun size={32} color="#64748B" />
              <Text style={styles.horoscopeEmptyTitle}>Henüz günlük yorum yok</Text>
              <Text style={styles.horoscopeEmptyText}>
                Bugün için özel yorumunuz hazırlanıyor
              </Text>
              <TouchableOpacity 
                style={styles.generateHoroscopeButton}
                onPress={() => loadTodaysHoroscope(true)}
              >
                <RefreshCw size={16} color="#FFFFFF" />
                <Text style={styles.generateHoroscopeButtonText}>Yenile</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* Features */}
        <View style={styles.featuresSection}>
          <Text style={styles.sectionTitle}>Özellikler</Text>
          
          <View style={styles.featureCard}>
            <Text style={styles.featureTitle}>🌟 Kişisel Doğum Haritası</Text>
            <Text style={styles.featureText}>Detaylı astroloji haritanızı oluşturun</Text>
          </View>
          
          <View style={styles.featureCard}>
            <Text style={styles.featureTitle}>🤖 AI Astroloji Danışmanı</Text>
            <Text style={styles.featureText}>Sorularınızı yapay zeka ile yanıtlayın</Text>
          </View>
          
          <View style={styles.featureCard}>
            <Text style={styles.featureTitle}>📊 Detaylı Raporlar</Text>
            <Text style={styles.featureText}>Günlük, aylık ve yıllık yorumlar</Text>
          </View>
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
  welcomeCard: {
    backgroundColor: 'rgba(139, 92, 246, 0.2)',
    marginHorizontal: 20,
    marginBottom: 24,
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(139, 92, 246, 0.3)',
  },
  welcomeTitle: {
    fontSize: 20,
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  welcomeSubtitle: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#CBD5E1',
    lineHeight: 20,
  },
  quickActions: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    gap: 12,
    marginBottom: 32,
  },
  actionCard: {
    flex: 1,
    backgroundColor: 'rgba(30, 41, 59, 0.8)',
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#334155',
    alignItems: 'center',
  },
  actionTitle: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF',
    marginTop: 8,
    textAlign: 'center',
  },
  actionSubtitle: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#94A3B8',
    marginTop: 2,
    textAlign: 'center',
  },
  section: {
    marginHorizontal: 20,
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF',
    marginBottom: 16,
  },
  horoscopeCard: {
    backgroundColor: 'rgba(30, 41, 59, 0.8)',
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#334155',
  },
  horoscopeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  horoscopeDate: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#F59E0B',
  },
  horoscopeText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#E2E8F0',
    lineHeight: 20,
  },
  horoscopeLoadingCard: {
    backgroundColor: 'rgba(30, 41, 59, 0.8)',
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#334155',
    alignItems: 'center',
    gap: 12,
  },
  horoscopeLoadingText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#CBD5E1',
    textAlign: 'center',
  },
  refreshButton: {
    padding: 4,
  },
  horoscopeReadMore: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#8B5CF6',
    marginTop: 8,
    textAlign: 'center',
  },
  horoscopeEmptyCard: {
    backgroundColor: 'rgba(30, 41, 59, 0.8)',
    padding: 32,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#334155',
    alignItems: 'center',
    gap: 12,
  },
  horoscopeEmptyTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF',
    textAlign: 'center',
  },
  horoscopeEmptyText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#94A3B8',
    textAlign: 'center',
    marginBottom: 16,
  },
  generateHoroscopeButton: {
    backgroundColor: '#8B5CF6',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  generateHoroscopeButtonText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#FFFFFF',
  },
  featuresSection: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  featureCard: {
    backgroundColor: 'rgba(30, 41, 59, 0.8)',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#334155',
    marginBottom: 12,
  },
  featureTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  featureText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#94A3B8',
  },
});