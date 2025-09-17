import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Animated, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { ArrowLeft, Star, Calendar, Heart, TrendingUp } from 'lucide-react-native';
import { ZodiacService } from '@/services/zodiacService';

const { width, height } = Dimensions.get('window');

export default function ZodiacDetailScreen() {
  const router = useRouter();
  const { sign, name } = useLocalSearchParams();
  
  const zodiacKey = (sign as string)?.toLowerCase();
  const data = ZodiacService.getZodiacSign(zodiacKey);

  // Debug için
  console.log('Zodiac Detail Debug:', {
    sign,
    name,
    zodiacKey,
    dataFound: !!data
  });

  // 3D Card Animation
  const [animatedValue] = useState(new Animated.Value(0));
  const [isFlipped, setIsFlipped] = useState(false);

  useEffect(() => {
    // Initial entrance animation
    Animated.spring(animatedValue, {
      toValue: 0,
      useNativeDriver: true,
      tension: 50,
      friction: 8,
    }).start();
  }, []);

  const flipCard = () => {
    setIsFlipped(!isFlipped);
    Animated.spring(animatedValue, {
      toValue: isFlipped ? 0 : 1,
      useNativeDriver: true,
      tension: 50,
      friction: 8,
    }).start();
  };

  const frontAnimatedStyle = {
    transform: [
      {
        rotateY: animatedValue.interpolate({
          inputRange: [0, 1],
          outputRange: ['0deg', '180deg'],
        }),
      },
    ],
  };

  const backAnimatedStyle = {
    transform: [
      {
        rotateY: animatedValue.interpolate({
          inputRange: [0, 1],
          outputRange: ['180deg', '360deg'],
        }),
      },
    ],
  };

  const handleExploreMore = () => {
    router.push(`/zodiac/daily-horoscope?sign=${sign}&name=${name}`);
  };

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
          <Text style={styles.headerTitle}>Zodiyak</Text>
        </View>

        {/* 3D Animated Card */}
        <View style={styles.cardContainer}>
          <TouchableOpacity onPress={flipCard} style={styles.card3D} activeOpacity={1}>
            {/* Front Card */}
            <Animated.View style={[styles.cardFace, styles.cardFront, frontAnimatedStyle]}>
              <LinearGradient
                colors={['#2D1B69', '#1E1B4B']}
                style={styles.cardGradient}
              >
                <View style={styles.cardHeader}>
                  <Text style={styles.cardTitle}>{data?.name.toUpperCase()}</Text>
                  <Text style={styles.cardDates}>{data?.dates}</Text>
                </View>
                
                <View style={styles.symbolContainer}>
                  <View style={styles.symbolGlow}>
                    <Text style={styles.zodiacSymbol3D}>{data?.symbol}</Text>
                  </View>
                </View>
                
                <View style={styles.cardInfo}>
                  <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>Yönetici Gezegen</Text>
                    <Text style={styles.infoValue}>{data?.planet}</Text>
                  </View>
                  <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>Element</Text>
                    <Text style={styles.infoValue}>{data?.element}</Text>
                  </View>
                  <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>Nitelik</Text>
                    <Text style={styles.infoValue}>Değişken</Text>
                  </View>
                  <View style={styles.infoRowKeywords}>
                    <Text style={styles.infoLabel}>Anahtar Kelimeler</Text>
                    <Text style={styles.infoValueKeywords}>{data?.traits.positive.slice(0, 3).join(', ')}</Text>
                  </View>
                </View>

                {/* Daha Fazlasını Keşfet Butonu - Ön yüzde */}
                <TouchableOpacity style={styles.exploreButtonFront} onPress={handleExploreMore}>
                  <Text style={styles.exploreButtonText}>Daha Fazlasını Keşfet</Text>
                </TouchableOpacity>
              </LinearGradient>
            </Animated.View>

            {/* Back Card */}
            <Animated.View style={[styles.cardFace, styles.cardBack, backAnimatedStyle]}>
              <LinearGradient
                colors={['#1E1B4B', '#2D1B69']}
                style={styles.cardGradient}
              >
                <View style={styles.backContent}>
                  <Text style={styles.backTitle}>{data?.name.toUpperCase()}</Text>
                  <Text style={styles.backSubtitle}>Burç Yorumu</Text>
                  <Text style={styles.backDescription}>{data?.description}</Text>
                  
                  <View style={styles.traitsSection}>
                    <View style={styles.traitsColumn}>
                      <Text style={styles.traitsTitle}>Olumlu Özellikler</Text>
                      {data?.traits.positive.slice(0, 3).map((trait, index) => (
                        <Text key={index} style={styles.traitItem}>• {trait}</Text>
                      ))}
                    </View>
                    <View style={styles.traitsColumn}>
                      <Text style={styles.traitsTitle}>Gelişim Alanları</Text>
                      {data?.traits.negative.slice(0, 3).map((trait, index) => (
                        <Text key={index} style={styles.traitItem}>• {trait}</Text>
                      ))}
                    </View>
                  </View>

                  <TouchableOpacity style={styles.exploreButtonBack} onPress={handleExploreMore}>
                    <Text style={styles.exploreButtonText}>Günlük Yorumları Gör</Text>
                  </TouchableOpacity>
                </View>
              </LinearGradient>
            </Animated.View>
          </TouchableOpacity>
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
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  // 3D Card Styles
  cardContainer: {
    height: 600,
    marginHorizontal: 20,
    marginBottom: 30,
  },
  card3D: {
    flex: 1,
    position: 'relative',
  },
  cardFace: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    backfaceVisibility: 'hidden',
    borderRadius: 20,
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.3,
    shadowRadius: 20,
  },
  cardFront: {
    zIndex: 2,
  },
  cardBack: {
    zIndex: 1,
  },
  cardGradient: {
    flex: 1,
    borderRadius: 20,
    padding: 24,
  },
  cardHeader: {
    alignItems: 'center',
    marginBottom: 20,
  },
  cardTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
    letterSpacing: 2,
  },
  cardDates: {
    fontSize: 14,
    color: '#94A3B8',
    marginTop: 5,
  },
  symbolContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 20,
  },
  symbolGlow: {
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: 'rgba(139, 92, 246, 0.1)',
    borderWidth: 2,
    borderColor: '#8B5CF6',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#8B5CF6',
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.8,
    shadowRadius: 20,
    elevation: 15,
  },
  zodiacSymbol3D: {
    fontSize: 72,
    color: '#FFFFFF',
    textShadowColor: '#8B5CF6',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
  },
  cardInfo: {
    marginTop: 20,
    marginBottom: 20,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  infoRowKeywords: {
    flexDirection: 'column',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  infoLabel: {
    fontSize: 14,
    color: '#94A3B8',
    fontWeight: '500',
  },
  infoValue: {
    fontSize: 14,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  infoValueKeywords: {
    fontSize: 14,
    color: '#FFFFFF',
    fontWeight: '600',
    marginTop: 4,
  },
  exploreButtonFront: {
    backgroundColor: '#8B5CF6',
    paddingVertical: 14,
    paddingHorizontal: 28,
    borderRadius: 25,
    alignSelf: 'center',
    shadowColor: '#8B5CF6',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 5,
    marginTop: 10,
  },
  // Back Card Styles
  backContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  backTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 10,
    letterSpacing: 2,
  },
  backSubtitle: {
    fontSize: 16,
    color: '#8B5CF6',
    fontWeight: '600',
    marginBottom: 20,
  },
  backDescription: {
    fontSize: 16,
    color: '#E2E8F0',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 30,
  },
  traitsSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 30,
  },
  traitsColumn: {
    flex: 1,
    paddingHorizontal: 10,
  },
  traitsTitle: {
    fontSize: 14,
    color: '#8B5CF6',
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  traitItem: {
    fontSize: 12,
    color: '#E2E8F0',
    marginBottom: 5,
    textAlign: 'center',
  },
  exploreButton: {
    backgroundColor: '#8B5CF6',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 25,
    shadowColor: '#8B5CF6',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 5,
  },
  exploreButtonBack: {
    backgroundColor: '#8B5CF6',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 25,
    shadowColor: '#8B5CF6',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 5,
  },
  exploreButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  bottomSpacing: {
    height: 40,
  },
});