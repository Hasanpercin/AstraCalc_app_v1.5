import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  FlatList, 
  TouchableOpacity, 
  StyleSheet, 
  SafeAreaView,
  ActivityIndicator,
  Alert
} from 'react-native';
import { useRouter } from 'expo-router';
import { ZodiacService } from '@/services/zodiacService';
import { ZodiacSign } from '@/types/zodiac';
import { FigmaTokens } from '@/constants/FigmaTokens';

export default function ZodiacListScreen() {
  const router = useRouter();
  const [zodiacSigns, setZodiacSigns] = useState<ZodiacSign[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadZodiacSigns();
  }, []);

  const loadZodiacSigns = async () => {
    try {
      setLoading(true);
      const { data, error } = await ZodiacService.getAllZodiacSigns();
      
      if (error) {
        Alert.alert('Hata', error);
        return;
      }

      setZodiacSigns(data);
    } catch (error) {
      console.error('Error loading zodiac signs:', error);
      Alert.alert('Hata', 'Burçlar yüklenirken bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  const navigateToDetail = (zodiacSign: ZodiacSign) => {
    router.push({
      pathname: '/zodiac/zodiac-detail',
      params: { 
        id: zodiacSign.id.toString(),
        name: zodiacSign.name 
      }
    });
  };

  const renderZodiacCard = ({ item }: { item: ZodiacSign }) => (
    <TouchableOpacity 
      style={styles.zodiacCard}
      onPress={() => navigateToDetail(item)}
      activeOpacity={0.8}
    >
      <View style={styles.cardContent}>
        <Text style={styles.zodiacSymbol}>{item.symbol}</Text>
        <Text style={styles.zodiacName}>{item.name}</Text>
        <Text style={styles.zodiacDateRange}>{item.date_range}</Text>
        <Text style={styles.zodiacElement}>{item.element}</Text>
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color="#6366f1" />
          <Text style={styles.loadingText}>Burçlar yükleniyor...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Burçlar</Text>
        <Text style={styles.subtitle}>Burcunuzu seçin ve detaylarını keşfedin</Text>
      </View>

      <FlatList
        data={zodiacSigns}
        renderItem={renderZodiacCard}
        keyExtractor={(item) => item.id.toString()}
        numColumns={2}
        columnWrapperStyle={styles.row}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: FigmaTokens.colors.background,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: FigmaTokens.colors.text,
    fontSize: FigmaTokens.typography.fontSize.subtitle,
    marginTop: FigmaTokens.spacing.lg,
    fontFamily: 'Inter-Regular',
  },
  header: {
    padding: FigmaTokens.spacing.xl,
    paddingBottom: FigmaTokens.spacing.md,
  },
  title: {
    fontSize: FigmaTokens.typography.fontSize.title,
    fontWeight: FigmaTokens.typography.fontWeight.bold,
    color: FigmaTokens.colors.text,
    marginBottom: FigmaTokens.spacing.sm,
    fontFamily: 'Inter-Bold',
  },
  subtitle: {
    fontSize: FigmaTokens.typography.fontSize.body,
    color: FigmaTokens.colors.textSecondary,
    fontFamily: 'Inter-Regular',
  },
  listContent: {
    padding: FigmaTokens.spacing.lg,
  },
  row: {
    flex: 1,
    justifyContent: 'space-between',
  },
  zodiacCard: {
    flex: 1,
    backgroundColor: FigmaTokens.colors.surface,
    borderRadius: FigmaTokens.borderRadius.lg,
    margin: FigmaTokens.spacing.sm,
    borderWidth: 1,
    borderColor: 'rgba(158, 148, 199, 0.2)',
    overflow: 'hidden',
  },
  cardContent: {
    padding: FigmaTokens.spacing.xl,
    alignItems: 'center',
    minHeight: 140,
    justifyContent: 'center',
  },
  zodiacSymbol: {
    fontSize: 32,
    marginBottom: FigmaTokens.spacing.sm,
  },
  zodiacName: {
    fontSize: FigmaTokens.typography.fontSize.subtitle,
    fontWeight: FigmaTokens.typography.fontWeight.medium,
    color: FigmaTokens.colors.text,
    marginBottom: 4,
    textAlign: 'center',
    fontFamily: 'Inter-SemiBold',
  },
  zodiacDateRange: {
    fontSize: FigmaTokens.typography.fontSize.body,
    color: FigmaTokens.colors.textSecondary,
    marginBottom: FigmaTokens.spacing.sm,
    textAlign: 'center',
    fontFamily: 'Inter-Regular',
  },
  zodiacElement: {
    fontSize: FigmaTokens.typography.fontSize.caption,
    color: FigmaTokens.colors.primary,
    fontWeight: FigmaTokens.typography.fontWeight.medium,
    textAlign: 'center',
    fontFamily: 'Inter-Medium',
  },
});
