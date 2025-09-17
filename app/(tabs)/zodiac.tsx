import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';

interface ZodiacSign {
  id: string;
  name: string;
  englishName: string;
  dates: string;
  element: string;
  symbol: string;
  description: string;
}

const zodiacSigns: ZodiacSign[] = [
  {
    id: 'koç',
    name: 'Koç',
    englishName: 'Aries',
    dates: '21 Mart - 19 Nisan',
    element: 'Ateş',
    symbol: '♈',
    description: 'Cesur, enerjik ve lider ruhlu'
  },
  {
    id: 'boğa',
    name: 'Boğa',
    englishName: 'Taurus',
    dates: '20 Nisan - 20 Mayıs',
    element: 'Toprak',
    symbol: '♉',
    description: 'Sabırlı, güvenilir ve kararlı'
  },
  {
    id: 'ikizler',
    name: 'İkizler',
    englishName: 'Gemini',
    dates: '21 Mayıs - 20 Haziran',
    element: 'Hava',
    symbol: '♊',
    description: 'Zeki, meraklı ve çok yönlü'
  },
  {
    id: 'yengeç',
    name: 'Yengeç',
    englishName: 'Cancer',
    dates: '21 Haziran - 22 Temmuz',
    element: 'Su',
    symbol: '♋',
    description: 'Duygusal, koruyucu ve sezgisel'
  },
  {
    id: 'aslan',
    name: 'Aslan',
    englishName: 'Leo',
    dates: '23 Temmuz - 22 Ağustos',
    element: 'Ateş',
    symbol: '♌',
    description: 'Gururlu, yaratıcı ve cömert'
  },
  {
    id: 'başak',
    name: 'Başak',
    englishName: 'Virgo',
    dates: '23 Ağustos - 22 Eylül',
    element: 'Toprak',
    symbol: '♍',
    description: 'Mükemmeliyetçi, analitik ve pratik'
  },
  {
    id: 'terazi',
    name: 'Terazi',
    englishName: 'Libra',
    dates: '23 Eylül - 22 Ekim',
    element: 'Hava',
    symbol: '♎',
    description: 'Adaletli, diplomatik ve uyumlu'
  },
  {
    id: 'akrep',
    name: 'Akrep',
    englishName: 'Scorpio',
    dates: '23 Ekim - 21 Kasım',
    element: 'Su',
    symbol: '♏',
    description: 'Tutkulu, gizemli ve güçlü'
  },
  {
    id: 'yay',
    name: 'Yay',
    englishName: 'Sagittarius',
    dates: '22 Kasım - 21 Aralık',
    element: 'Ateş',
    symbol: '♐',
    description: 'Maceracı, iyimser ve özgür ruhlu'
  },
  {
    id: 'oğlak',
    name: 'Oğlak',
    englishName: 'Capricorn',
    dates: '22 Aralık - 19 Ocak',
    element: 'Toprak',
    symbol: '♑',
    description: 'Disiplinli, hırslı ve sorumluluk sahibi'
  },
  {
    id: 'kova',
    name: 'Kova',
    englishName: 'Aquarius',
    dates: '20 Ocak - 18 Şubat',
    element: 'Hava',
    symbol: '♒',
    description: 'Yenilikçi, bağımsız ve insancıl'
  },
  {
    id: 'balık',
    name: 'Balık',
    englishName: 'Pisces',
    dates: '19 Şubat - 20 Mart',
    element: 'Su',
    symbol: '♓',
    description: 'Hayal gücü yüksek, şefkatli ve sezgisel'
  }
];

const getElementColor = (element: string) => {
  switch (element) {
    case 'Ateş': return ['#FF6B6B', '#FF8E8E'];
    case 'Toprak': return ['#8B5A3C', '#A0522D'];
    case 'Hava': return ['#4ECDC4', '#44A08D'];
    case 'Su': return ['#4A90E2', '#357ABD'];
    default: return ['#8B5CF6', '#A855F7'];
  }
};

export default function ZodiacScreen() {
  const router = useRouter();

  const handleZodiacPress = (zodiac: ZodiacSign) => {
    router.push(`/zodiac/zodiac-detail?sign=${zodiac.id}&name=${zodiac.name}`);
  };

  return (
    <LinearGradient
      colors={['#1E1B4B', '#312E81', '#1E1B4B']}
      style={styles.container}
    >
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>Burçlar</Text>
          <Text style={styles.subtitle}>Hangi burç hakkında bilgi almak istiyorsunuz?</Text>
        </View>

        <View style={styles.zodiacGrid}>
          {zodiacSigns.map((zodiac) => (
            <TouchableOpacity
              key={zodiac.id}
              style={styles.zodiacCard}
              onPress={() => handleZodiacPress(zodiac)}
            >
              <LinearGradient
                colors={getElementColor(zodiac.element)}
                style={styles.cardGradient}
              >
                <View style={styles.cardContent}>
                  <Text style={styles.zodiacSymbol}>{zodiac.symbol}</Text>
                  <Text style={styles.zodiacName}>{zodiac.name}</Text>
                  <Text style={styles.zodiacDates}>{zodiac.dates}</Text>
                  <View style={styles.elementContainer}>
                    <Text style={styles.elementText}>{zodiac.element}</Text>
                  </View>
                  <Text style={styles.zodiacDescription}>{zodiac.description}</Text>
                </View>
              </LinearGradient>
            </TouchableOpacity>
          ))}
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
    paddingHorizontal: 20,
  },
  header: {
    paddingTop: 60,
    paddingBottom: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#94A3B8',
    textAlign: 'center',
    lineHeight: 22,
  },
  zodiacGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingBottom: 100,
  },
  zodiacCard: {
    width: '48%',
    marginBottom: 16,
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  cardGradient: {
    padding: 16,
    minHeight: 180,
  },
  cardContent: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  zodiacSymbol: {
    fontSize: 32,
    color: '#FFFFFF',
    marginBottom: 8,
  },
  zodiacName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  zodiacDates: {
    fontSize: 12,
    color: '#FFFFFF',
    opacity: 0.9,
    marginBottom: 8,
    textAlign: 'center',
  },
  elementContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginBottom: 8,
  },
  elementText: {
    fontSize: 12,
    color: '#FFFFFF',
    fontWeight: '500',
  },
  zodiacDescription: {
    fontSize: 11,
    color: '#FFFFFF',
    opacity: 0.8,
    textAlign: 'center',
    lineHeight: 16,
  },
});