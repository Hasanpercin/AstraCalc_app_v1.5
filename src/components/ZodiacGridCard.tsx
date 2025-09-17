// src/components/ZodiacGridCard.tsx
import React from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  StyleSheet, 
  Dimensions 
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { ZodiacGridCardProps } from '../types/zodiac';

const { width } = Dimensions.get('window');
const cardWidth = (width - 60) / 2; // 30 margin, 2 columns

const ZodiacGridCard: React.FC<ZodiacGridCardProps> = ({ sign, onPress }) => {
  // Burç sembollerini emoji'lerle eşleştir
  const getZodiacEmoji = (symbol: string) => {
    const emojiMap: { [key: string]: string } = {
      '♈': '🐏', // Koç
      '♉': '🐂', // Boğa  
      '♊': '👯', // İkizler
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

  return (
    <TouchableOpacity onPress={onPress} style={styles.container}>
      <LinearGradient
        colors={['rgba(255, 215, 0, 0.1)', 'rgba(255, 165, 0, 0.05)']}
        style={styles.gradient}
      >
        <View style={styles.card}>
          {/* Burç Sembolü */}
          <View style={styles.symbolContainer}>
            <Text style={styles.symbolEmoji}>
              {getZodiacEmoji(sign.symbol)}
            </Text>
            <Text style={styles.symbol}>
              {sign.symbol}
            </Text>
          </View>
          
          {/* Burç Adı */}
          <Text style={styles.name}>
            {sign.name}
          </Text>
          
          {/* Tarih Aralığı */}
          <Text style={styles.dateRange}>
            {sign.date_range}
          </Text>
          
          {/* Element */}
          <View style={styles.elementContainer}>
            <Text style={styles.element}>
              {sign.element}
            </Text>
          </View>
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    margin: 8,
    borderRadius: 20,
    overflow: 'hidden',
  },
  gradient: {
    borderRadius: 20,
  },
  card: {
    width: cardWidth,
    height: cardWidth * 1.2,
    backgroundColor: 'rgba(20, 19, 61, 0.9)',
    borderRadius: 20,
    padding: 15,
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: 'rgba(255, 215, 0, 0.3)',
  },
  symbolContainer: {
    alignItems: 'center',
    marginBottom: 10,
  },
  symbolEmoji: {
    fontSize: 40,
    marginBottom: 5,
  },
  symbol: {
    fontSize: 24,
    color: '#FFD700',
    fontWeight: 'bold',
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 5,
  },
  dateRange: {
    fontSize: 12,
    color: '#B0B0B0',
    textAlign: 'center',
    marginBottom: 10,
  },
  elementContainer: {
    backgroundColor: 'rgba(255, 215, 0, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 215, 0, 0.5)',
  },
  element: {
    fontSize: 10,
    color: '#FFD700',
    fontWeight: '600',
    textAlign: 'center',
  },
});

export default ZodiacGridCard;