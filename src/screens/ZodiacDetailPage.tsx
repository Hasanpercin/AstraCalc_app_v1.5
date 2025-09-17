// src/screens/ZodiacDetailPage.tsx
import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  ScrollView,
  Dimensions,
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';

import { ZodiacStackParamList } from '../types/zodiac';

type ZodiacDetailRouteProp = RouteProp<ZodiacStackParamList, 'ZodiacDetail'>;
type ZodiacDetailNavigationProp = NativeStackNavigationProp<ZodiacStackParamList, 'ZodiacDetail'>;

const { width, height } = Dimensions.get('window');

const ZodiacDetailPage: React.FC = () => {
  const route = useRoute<ZodiacDetailRouteProp>();
  const navigation = useNavigation<ZodiacDetailNavigationProp>();
  const { sign } = route.params;

  // Burç sembollerini 3D style emoji'lerle eşleştir
  const getZodiac3DEmoji = (symbol: string) => {
    const emojiMap: { [key: string]: string } = {
      '♈': '🐏', // Koç
      '♉': '🐂', // Boğa  
      '♊': '👯‍♀️', // İkizler
      '♋': '🦀', // Yengeç
      '♌': '🦁', // Aslan
      '♍': '👩‍🌾', // Başak
      '♎': '⚖️', // Terazi
      '♏': '🦂', // Akrep
      '♐': '🏹', // Yay
      '♑': '🐐', // Oğlak
      '♒': '🏺', // Kova
      '♓': '🐠', // Balık
    };
    return emojiMap[symbol] || symbol;
  };

  const handleExploreMore = () => {
    navigation.navigate('DailyHoroscope', { sign });
  };

  const handleGoBack = () => {
    navigation.goBack();
  };

  return (
    <LinearGradient
      colors={['#0A092D', '#1a1a3e', '#2a2a5e']}
      style={styles.container}
    >
      <StatusBar barStyle="light-content" backgroundColor="#0A092D" />
      
      <SafeAreaView style={styles.safeArea}>
        {/* Custom Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={handleGoBack} style={styles.backButton}>
            <Text style={styles.backIcon}>✕</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Zodiyak</Text>
          <View style={styles.placeholder} />
        </View>

        <ScrollView 
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Burç Kartı Ana Container */}
          <View style={styles.cardContainer}>
            <LinearGradient
              colors={['rgba(255, 215, 0, 0.1)', 'rgba(255, 165, 0, 0.05)']}
              style={styles.cardGradient}
            >
              <View style={styles.card}>
                {/* 3D Burç Simgesi */}
                <View style={styles.symbolContainer}>
                  <LinearGradient
                    colors={['#FFD700', '#FFA500', '#FF8C00']}
                    style={styles.symbolBackground}
                  >
                    <Text style={styles.symbol3D}>
                      {getZodiac3DEmoji(sign.symbol)}
                    </Text>
                  </LinearGradient>
                </View>

                {/* Burç Adı */}
                <Text style={styles.zodiacName}>
                  {sign.name.toUpperCase()}
                </Text>

                {/* Bilgi Satırları */}
                <View style={styles.infoContainer}>
                  <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>Yönetici Gezegen</Text>
                    <Text style={styles.infoValue}>{sign.ruling_planet}</Text>
                  </View>

                  <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>Element</Text>
                    <Text style={styles.infoValue}>{sign.element}</Text>
                  </View>

                  <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>Nitelik</Text>
                    <Text style={styles.infoValue}>{sign.quality}</Text>
                  </View>

                  <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>Tarih Aralığı</Text>
                    <Text style={styles.infoValue}>{sign.date_range}</Text>
                  </View>
                </View>

                {/* Anahtar Kelimeler */}
                <View style={styles.keywordsContainer}>
                  <Text style={styles.keywordsTitle}>Anahtar Kelimeler</Text>
                  <View style={styles.keywordsList}>
                    {sign.keywords.map((keyword, index) => (
                      <View key={index} style={styles.keywordTag}>
                        <Text style={styles.keywordText}>{keyword}</Text>
                      </View>
                    ))}
                  </View>
                </View>
              </View>
            </LinearGradient>
          </View>

          {/* Daha Fazlasını Keşfet Butonu */}
          <TouchableOpacity 
            style={styles.exploreButton}
            onPress={handleExploreMore}
          >
            <LinearGradient
              colors={['#8B5CF6', '#A855F7', '#C084FC']}
              style={styles.exploreGradient}
            >
              <Text style={styles.exploreButtonText}>
                Daha Fazlasını Keşfet
              </Text>
            </LinearGradient>
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  backIcon: {
    fontSize: 18,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  placeholder: {
    width: 40,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  cardContainer: {
    marginTop: 20,
    borderRadius: 30,
    overflow: 'hidden',
  },
  cardGradient: {
    borderRadius: 30,
  },
  card: {
    backgroundColor: 'rgba(20, 19, 61, 0.95)',
    borderRadius: 30,
    padding: 30,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 215, 0, 0.3)',
    minHeight: height * 0.6,
    justifyContent: 'space-around',
  },
  symbolContainer: {
    marginBottom: 30,
  },
  symbolBackground: {
    width: 120,
    height: 120,
    borderRadius: 60,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#FFD700',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.44,
    shadowRadius: 10.32,
    elevation: 16,
  },
  symbol3D: {
    fontSize: 60,
  },
  zodiacName: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 30,
    letterSpacing: 2,
  },
  infoContainer: {
    width: '100%',
    marginBottom: 30,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 215, 0, 0.2)',
  },
  infoLabel: {
    fontSize: 16,
    color: '#B0B0B0',
    fontWeight: '500',
  },
  infoValue: {
    fontSize: 16,
    color: '#FFD700',
    fontWeight: 'bold',
  },
  keywordsContainer: {
    width: '100%',
    alignItems: 'center',
  },
  keywordsTitle: {
    fontSize: 18,
    color: '#FFFFFF',
    fontWeight: 'bold',
    marginBottom: 15,
  },
  keywordsList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 8,
  },
  keywordTag: {
    backgroundColor: 'rgba(255, 215, 0, 0.2)',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 215, 0, 0.5)',
    margin: 4,
  },
  keywordText: {
    fontSize: 12,
    color: '#FFD700',
    fontWeight: '600',
  },
  exploreButton: {
    marginTop: 30,
    borderRadius: 25,
    overflow: 'hidden',
  },
  exploreGradient: {
    paddingVertical: 18,
    paddingHorizontal: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  exploreButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
});

export default ZodiacDetailPage;