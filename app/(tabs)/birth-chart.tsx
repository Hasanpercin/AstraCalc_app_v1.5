import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, RefreshControl } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { Circle, Star, Plus, Sun, Moon, TrendingUp, User, RefreshCw } from 'lucide-react-native';
import { useAuth } from '../../hooks/useAuth';
import { AstrologyDataService, AstrologyInterpretationData } from '../../services/astrologyDataService';

export default function BirthChartScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const [astrologyData, setAstrologyData] = useState<AstrologyInterpretationData | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      loadAstrologyData();
    } else {
      // For non-authenticated users, show empty state
      setLoading(false);
      setAstrologyData(null);
    }
  }, [user]);

  const loadAstrologyData = async (isRefresh: boolean = false) => {
    if (!user?.id) {
      console.warn('⚠️ No authenticated user - cannot load astrology data');
      setLoading(false);
      setAstrologyData(null);
      return;
    }

    try {
      if (!isRefresh) {
        setLoading(true);
      }
      setError(null);

      console.log('🔍 Loading personalized astrology data for user:', user.id);

      // Fetch user-specific astrology interpretation data
      const result = await AstrologyDataService.getUserAstrologyInterpretation(user.id);

      if (result.error) {
        console.error('❌ Error loading astrology data:', result.error);
        setError(result.error);
        setAstrologyData(null);
      } else if (result.data) {
        console.log('✅ Astrology data loaded successfully');
        setAstrologyData(result.data);
        setError(null);
      } else {
        console.log('ℹ️ No astrology data found for user');
        setAstrologyData(null);
        setError(null);
      }
    } catch (error) {
      console.error('💥 Unexpected error loading astrology data:', error);
      setError(error instanceof Error ? error.message : 'Beklenmeyen hata oluştu');
      setAstrologyData(null);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadAstrologyData(true);
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return '';
    
    try {
      // Handle DD-MM-YYYY format
      if (dateString.match(/^\d{2}-\d{2}-\d{4}$/)) {
        const [day, month, year] = dateString.split('-');
        const date = new Date(`${year}-${month}-${day}`);
        return date.toLocaleDateString('tr-TR', {
          day: 'numeric',
          month: 'long',
          year: 'numeric'
        });
      }
      
      // Handle other date formats
      const date = new Date(dateString);
      if (!isNaN(date.getTime())) {
        return date.toLocaleDateString('tr-TR', {
          day: 'numeric',
          month: 'long',
          year: 'numeric'
        });
      }
      
      return dateString;
    } catch {
      return dateString;
    }
  };

  if (loading) {
    return (
      <LinearGradient
        colors={['#1E1B4B', '#312E81', '#4C1D95']}
        style={styles.container}
      >
        <View style={styles.loadingContainer}>
          <Circle size={64} color="#8B5CF6" strokeWidth={2} />
          <Text style={styles.loadingText}>Doğum haritanız yükleniyor...</Text>
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
          <Text style={styles.title}>Doğum Haritası</Text>
          {astrologyData && (
            <Text style={styles.subtitle}>{astrologyData.full_name}</Text>
          )}
        </View>

        {!user ? (
          // Not authenticated state
          <View style={styles.notAuthenticatedContainer}>
            <View style={styles.chartPlaceholder}>
              <Circle size={120} color="#64748B" strokeWidth={2} />
              <User size={40} color="#64748B" style={styles.centerIcon} />
            </View>
            <Text style={styles.notAuthTitle}>Giriş Yapmanız Gerekiyor</Text>
            <Text style={styles.notAuthSubtitle}>
              Kişisel doğum haritanızı görmek için giriş yapın
            </Text>
            <TouchableOpacity 
              style={styles.loginButton}
              onPress={() => router.push('/auth/login')}
            >
              <Text style={styles.loginButtonText}>Giriş Yap</Text>
            </TouchableOpacity>
          </View>
        ) : !astrologyData ? (
          // No astrology data state
          <View style={styles.noDataContainer}>
            <View style={styles.chartPlaceholder}>
              <Circle size={120} color="#8B5CF6" strokeWidth={2} />
              <Star size={40} color="#F59E0B" fill="#F59E0B" style={styles.centerIcon} />
            </View>
            <Text style={styles.noDataTitle}>Henüz Doğum Haritanız Yok</Text>
            <Text style={styles.noDataSubtitle}>
              Kişisel astroloji yorumunuz için doğum bilgilerinizi girin
            </Text>
            <TouchableOpacity 
              style={styles.createButton}
              onPress={() => router.push('/birth-form')}
            >
              <Plus size={20} color="#FFFFFF" />
              <Text style={styles.createButtonText}>Doğum Haritası Oluştur</Text>
            </TouchableOpacity>
          </View>
        ) : (
          // Astrology data exists - display chart
          <View style={styles.chartDataContainer}>
            {/* Chart Visual */}
            <View style={styles.chartContainer}>
              <View style={styles.chartPlaceholder}>
                <Circle size={120} color="#8B5CF6" strokeWidth={2} />
                <Star size={40} color="#F59E0B" fill="#F59E0B" style={styles.centerIcon} />
              </View>
              <Text style={styles.chartTitle}>Kişisel Doğum Haritanız</Text>
              {astrologyData.dogum_tarihi && (
                <Text style={styles.chartDate}>
                  {formatDate(astrologyData.dogum_tarihi)}
                  {astrologyData.dogum_saati && ` - ${astrologyData.dogum_saati}`}
                </Text>
              )}
              {astrologyData.dogum_yeri && (
                <Text style={styles.chartLocation}>{astrologyData.dogum_yeri}</Text>
              )}
            </View>

            {/* Zodiac Signs Section */}
            <View style={styles.signsSection}>
              <Text style={styles.sectionTitle}>Astroloji Haritanız</Text>
              
              <View style={styles.signsGrid}>
                {/* Sun Sign */}
                <View style={styles.signCard}>
                  <Sun size={32} color="#F59E0B" />
                  <Text style={styles.signTitle}>Güneş Burcu</Text>
                  <Text style={styles.signValue}>
                    {astrologyData.sun_sign || 'Hesaplanıyor...'}
                  </Text>
                </View>
                
                {/* Moon Sign */}
                <View style={styles.signCard}>
                  <Moon size={32} color="#8B5CF6" />
                  <Text style={styles.signTitle}>Ay Burcu</Text>
                  <Text style={styles.signValue}>
                    {astrologyData.moon_sign || 'Hesaplanıyor...'}
                  </Text>
                </View>
                
                {/* Rising Sign */}
                <View style={styles.signCard}>
                  <TrendingUp size={32} color="#10B981" />
                  <Text style={styles.signTitle}>Yükselen Burç</Text>
                  <Text style={styles.signValue}>
                    {astrologyData.rising_sign || 'Hesaplanıyor...'}
                  </Text>
                </View>
              </View>
            </View>

            {/* Interpretation Section */}
            {astrologyData.interpretation && (
              <View style={styles.interpretationSection}>
                <Text style={styles.sectionTitle}>Doğum Haritası Yorumu</Text>
                <View style={styles.interpretationCard}>
                  <ScrollView 
                    style={styles.interpretationScroll}
                    showsVerticalScrollIndicator={true}
                    nestedScrollEnabled={true}
                  >
                    <Text style={styles.interpretationText}>
                      {astrologyData.interpretation}
                    </Text>
                  </ScrollView>
                </View>
              </View>
            )}

            {/* Chart Information */}
            <View style={styles.chartInfoSection}>
              <Text style={styles.sectionTitle}>Harita Bilgileri</Text>
              <View style={styles.infoCard}>
                <View style={styles.infoItem}>
                  <Text style={styles.infoLabel}>Oluşturulma Tarihi</Text>
                  <Text style={styles.infoValue}>
                    {new Date(astrologyData.created_at).toLocaleDateString('tr-TR', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </Text>
                </View>
                {astrologyData.updated_at !== astrologyData.created_at && (
                  <View style={styles.infoItem}>
                    <Text style={styles.infoLabel}>Son Güncelleme</Text>
                    <Text style={styles.infoValue}>
                      {new Date(astrologyData.updated_at).toLocaleDateString('tr-TR', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </Text>
                  </View>
                )}
              </View>
            </View>

            {/* Action Buttons */}
            <View style={styles.actionButtons}>
              <TouchableOpacity 
                style={styles.updateButton}
                onPress={() => router.push('/birth-form')}
              >
                <RefreshCw size={20} color="#FFFFFF" />
                <Text style={styles.updateButtonText}>Haritayı Güncelle</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* Error State */}
        {error && (
          <View style={styles.errorContainer}>
            <Text style={styles.errorTitle}>Bir Hata Oluştu</Text>
            <Text style={styles.errorMessage}>{error}</Text>
            <TouchableOpacity 
              style={styles.retryButton}
              onPress={() => loadAstrologyData()}
            >
              <RefreshCw size={16} color="#FFFFFF" />
              <Text style={styles.retryButtonText}>Tekrar Dene</Text>
            </TouchableOpacity>
          </View>
        )}
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
    marginTop: 20,
  },
  header: {
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: '#A5A3FF',
  },
  notAuthenticatedContainer: {
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 60,
  },
  notAuthTitle: {
    fontSize: 22,
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
    marginBottom: 12,
    textAlign: 'center',
  },
  notAuthSubtitle: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#CBD5E1',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 32,
  },
  loginButton: {
    backgroundColor: '#8B5CF6',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 12,
    shadowColor: '#8B5CF6',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 8,
  },
  loginButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
  },
  noDataContainer: {
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 60,
  },
  chartDataContainer: {
    paddingBottom: 40,
  },
  chartContainer: {
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 32,
  },
  chartPlaceholder: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  centerIcon: {
    position: 'absolute',
  },
  chartTitle: {
    fontSize: 20,
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF',
    marginBottom: 8,
    textAlign: 'center',
  },
  noDataTitle: {
    fontSize: 22,
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
    marginBottom: 12,
    textAlign: 'center',
  },
  noDataSubtitle: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#CBD5E1',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 32,
  },
  chartDate: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#8B5CF6',
    textAlign: 'center',
    marginBottom: 4,
  },
  chartLocation: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#94A3B8',
    textAlign: 'center',
  },
  createButton: {
    backgroundColor: '#8B5CF6',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
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
  createButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
  },
  signsSection: {
    paddingHorizontal: 20,
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
    marginBottom: 16,
  },
  signsGrid: {
    gap: 16,
  },
  signCard: {
    backgroundColor: 'rgba(30, 41, 59, 0.8)',
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#334155',
    alignItems: 'center',
    flexDirection: 'row',
    gap: 16,
  },
  signTitle: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: '#E2E8F0',
    flex: 1,
  },
  signValue: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF',
  },
  interpretationSection: {
    paddingHorizontal: 20,
    marginBottom: 32,
  },
  interpretationCard: {
    backgroundColor: 'rgba(30, 41, 59, 0.8)',
    padding: 24,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#334155',
    height: 400,
  },
  interpretationScroll: {
    flex: 1,
  },
  interpretationText: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#E2E8F0',
    lineHeight: 26,
    textAlign: 'left',
  },
  chartInfoSection: {
    paddingHorizontal: 20,
    marginBottom: 32,
  },
  infoCard: {
    backgroundColor: 'rgba(30, 41, 59, 0.8)',
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#334155',
  },
  infoItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  infoLabel: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#94A3B8',
  },
  infoValue: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#E2E8F0',
    textAlign: 'right',
    flex: 1,
    marginLeft: 16,
  },
  actionButtons: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  updateButton: {
    backgroundColor: '#F59E0B',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  updateButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
  },
  errorContainer: {
    marginHorizontal: 20,
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    padding: 24,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.3)',
    alignItems: 'center',
  },
  errorTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#EF4444',
    marginBottom: 8,
    textAlign: 'center',
  },
  errorMessage: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#FCA5A5',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 16,
  },
  retryButton: {
    backgroundColor: '#EF4444',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  retryButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
  },
});