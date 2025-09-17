import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { ArrowLeft, Star, Calendar, Heart, TrendingUp } from 'lucide-react-native';
import { ZodiacService } from '@/services/zodiacService';

export default function ZodiacDetailScreen() {
  const router = useRouter();
  const { sign, name } = useLocalSearchParams();
  
  const zodiacKey = (sign as string)?.toLowerCase();
  const data = ZodiacService.getZodiacSign(zodiacKey);

  if (!data) {
    return (
      <LinearGradient
        colors={['#1E1B4B', '#312E81', '#4C1D95']}
        style={styles.container}
      >
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Burç bilgisi bulunamadı</Text>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Text style={styles.backButtonText}>Geri Dön</Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>
    );
  }

  return (
    <LinearGradient
      colors={['#1E1B4B', '#312E81', '#4C1D95']}
      style={styles.container}
    >
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.headerBackButton}
            onPress={() => router.back()}
          >
            <ArrowLeft size={24} color="#FFFFFF" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{data.name} Burcu</Text>
        </View>

        {/* Zodiac Symbol Card */}
        <View style={styles.symbolCard}>
          <Text style={styles.zodiacSymbol}>{data.symbol}</Text>
          <Text style={styles.zodiacName}>{data.name}</Text>
          <Text style={styles.zodiacDates}>{data.dates}</Text>
          <View style={styles.elementBadge}>
            <Text style={styles.elementText}>{data.element} Burcu</Text>
          </View>
        </View>

        {/* Description */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Genel Özellikler</Text>
          <View style={styles.card}>
            <Text style={styles.description}>{data.description}</Text>
          </View>
        </View>

        {/* Traits */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Kişilik Özellikleri</Text>
          
          {/* Positive Traits */}
          <View style={styles.traitsCard}>
            <View style={styles.traitHeader}>
              <Star size={20} color="#10B981" />
              <Text style={styles.traitTitle}>Olumlu Özellikler</Text>
            </View>
            <View style={styles.traitsList}>
              {data.traits.positive.map((trait, index) => (
                <View key={index} style={styles.traitItem}>
                  <View style={[styles.traitDot, { backgroundColor: '#10B981' }]} />
                  <Text style={styles.traitText}>{trait}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* Negative Traits */}
          <View style={styles.traitsCard}>
            <View style={styles.traitHeader}>
              <TrendingUp size={20} color="#F59E0B" />
              <Text style={styles.traitTitle}>Geliştirilmesi Gereken Özellikler</Text>
            </View>
            <View style={styles.traitsList}>
              {data.traits.negative.map((trait, index) => (
                <View key={index} style={styles.traitItem}>
                  <View style={[styles.traitDot, { backgroundColor: '#F59E0B' }]} />
                  <Text style={styles.traitText}>{trait}</Text>
                </View>
              ))}
            </View>
          </View>
        </View>

        {/* Compatibility */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Uyumlu Burçlar</Text>
          <View style={styles.card}>
            <View style={styles.compatibilityHeader}>
              <Heart size={20} color="#EF4444" />
              <Text style={styles.compatibilityTitle}>En Uyumlu Burçlar</Text>
            </View>
            <View style={styles.compatibilityList}>
              {data.compatibility.map((sign, index) => (
                <View key={index} style={styles.compatibilityItem}>
                  <Text style={styles.compatibilityText}>{sign}</Text>
                </View>
              ))}
            </View>
          </View>
        </View>

        {/* Lucky Elements */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Şanslı Unsurlar</Text>
          
          <View style={styles.luckyCard}>
            <View style={styles.luckySection}>
              <Text style={styles.luckyLabel}>Şanslı Sayılar</Text>
              <View style={styles.luckyNumbersList}>
                {data.luckyNumbers.map((number, index) => (
                  <View key={index} style={styles.luckyNumber}>
                    <Text style={styles.luckyNumberText}>{number}</Text>
                  </View>
                ))}
              </View>
            </View>

            <View style={styles.luckySection}>
              <Text style={styles.luckyLabel}>Şanslı Renkler</Text>
              <View style={styles.luckyColorsList}>
                {data.luckyColors.map((color, index) => (
                  <View key={index} style={styles.luckyColor}>
                    <Text style={styles.luckyColorText}>{color}</Text>
                  </View>
                ))}
              </View>
            </View>
          </View>
        </View>

        <View style={styles.bottomSpacing} />
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
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  errorText: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 20,
  },
  backButton: {
    backgroundColor: '#8B5CF6',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
  },
  backButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  headerBackButton: {
    padding: 8,
    marginRight: 16,
  },
  headerTitle: {
    fontSize: 20,
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF',
  },
  symbolCard: {
    backgroundColor: 'rgba(30, 41, 59, 0.8)',
    marginHorizontal: 20,
    marginBottom: 24,
    padding: 32,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#334155',
    alignItems: 'center',
  },
  zodiacSymbol: {
    fontSize: 80,
    marginBottom: 16,
  },
  zodiacName: {
    fontSize: 28,
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  zodiacDates: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#94A3B8',
    marginBottom: 16,
  },
  elementBadge: {
    backgroundColor: 'rgba(139, 92, 246, 0.2)',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#8B5CF6',
  },
  elementText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#8B5CF6',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
    marginHorizontal: 20,
    marginBottom: 12,
  },
  card: {
    backgroundColor: 'rgba(30, 41, 59, 0.8)',
    marginHorizontal: 20,
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#334155',
  },
  description: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#E2E8F0',
    lineHeight: 24,
  },
  traitsCard: {
    backgroundColor: 'rgba(30, 41, 59, 0.8)',
    marginHorizontal: 20,
    marginBottom: 16,
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#334155',
  },
  traitHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
  },
  traitTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF',
  },
  traitsList: {
    gap: 12,
  },
  traitItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  traitDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  traitText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#CBD5E1',
  },
  compatibilityHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
  },
  compatibilityTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF',
  },
  compatibilityList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  compatibilityItem: {
    backgroundColor: 'rgba(239, 68, 68, 0.2)',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#EF4444',
  },
  compatibilityText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#FCA5A5',
  },
  luckyCard: {
    backgroundColor: 'rgba(30, 41, 59, 0.8)',
    marginHorizontal: 20,
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#334155',
  },
  luckySection: {
    marginBottom: 20,
  },
  luckyLabel: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF',
    marginBottom: 12,
  },
  luckyNumbersList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  luckyNumber: {
    backgroundColor: 'rgba(139, 92, 246, 0.2)',
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#8B5CF6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  luckyNumberText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#C4B5FD',
  },
  luckyColorsList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  luckyColor: {
    backgroundColor: 'rgba(16, 185, 129, 0.2)',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#10B981',
  },
  luckyColorText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#6EE7B7',
  },
  bottomSpacing: {
    height: 40,
  },
});