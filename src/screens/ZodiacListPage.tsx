// src/screens/ZodiacListPage.tsx
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  StyleSheet,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { LinearGradient } from 'expo-linear-gradient';

import { ZodiacSign, ZodiacStackParamList } from '../types/zodiac';
import { supabase } from '../lib/supabaseClient';
import ZodiacGridCard from '../components/ZodiacGridCard';

type ZodiacListNavigationProp = NativeStackNavigationProp<ZodiacStackParamList, 'ZodiacList'>;

const ZodiacListPage: React.FC = () => {
  const [zodiacs, setZodiacs] = useState<ZodiacSign[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const navigation = useNavigation<ZodiacListNavigationProp>();

  // Mock data for development - Later replace with Supabase call
  const mockZodiacData: ZodiacSign[] = [
    {
      id: 1,
      name: 'Koç',
      symbol: '♈',
      date_range: '21 Mar - 19 Nis',
      ruling_planet: 'Mars',
      element: 'Ateş',
      quality: 'Kardinal',
      keywords: ['Cesur', 'Lider', 'Enerjik']
    },
    {
      id: 2,
      name: 'Boğa',
      symbol: '♉',
      date_range: '20 Nis - 20 May',
      ruling_planet: 'Venüs',
      element: 'Toprak',
      quality: 'Sabit',
      keywords: ['Sabırlı', 'Güvenilir', 'Kararlı']
    },
    {
      id: 3,
      name: 'İkizler',
      symbol: '♊',
      date_range: '21 May - 20 Haz',
      ruling_planet: 'Merkür',
      element: 'Hava',
      quality: 'Değişken',
      keywords: ['Zeki', 'İletişimci', 'Adaptasyon']
    },
    {
      id: 4,
      name: 'Yengeç',
      symbol: '♋',
      date_range: '21 Haz - 22 Tem',
      ruling_planet: 'Ay',
      element: 'Su',
      quality: 'Kardinal',
      keywords: ['Koruyucu', 'Empatik', 'Sezgisel']
    },
    {
      id: 5,
      name: 'Aslan',
      symbol: '♌',
      date_range: '23 Tem - 22 Ağu',
      ruling_planet: 'Güneş',
      element: 'Ateş',
      quality: 'Sabit',
      keywords: ['Yaratıcı', 'Cömert', 'Lider']
    },
    {
      id: 6,
      name: 'Başak',
      symbol: '♍',
      date_range: '23 Ağu - 22 Eyl',
      ruling_planet: 'Merkür',
      element: 'Toprak',
      quality: 'Değişken',
      keywords: ['Analitik', 'Detaycı', 'Güvenilir']
    },
    {
      id: 7,
      name: 'Terazi',
      symbol: '♎',
      date_range: '23 Eyl - 22 Eki',
      ruling_planet: 'Venüs',
      element: 'Hava',
      quality: 'Kardinal',
      keywords: ['Diplomatik', 'Adil', 'Sosyal']
    },
    {
      id: 8,
      name: 'Akrep',
      symbol: '♏',
      date_range: '23 Eki - 21 Kas',
      ruling_planet: 'Mars/Plüton',
      element: 'Su',
      quality: 'Sabit',
      keywords: ['Tutkulu', 'Sadık', 'Cesur']
    },
    {
      id: 9,
      name: 'Yay',
      symbol: '♐',
      date_range: '22 Kas - 21 Ara',
      ruling_planet: 'Jüpiter',
      element: 'Ateş',
      quality: 'Değişken',
      keywords: ['İyimser', 'Özgür', 'Maceracı']
    },
    {
      id: 10,
      name: 'Oğlak',
      symbol: '♑',
      date_range: '22 Ara - 19 Oca',
      ruling_planet: 'Satürn',
      element: 'Toprak',
      quality: 'Kardinal',
      keywords: ['Disiplinli', 'Çalışkan', 'Sabırlı']
    },
    {
      id: 11,
      name: 'Kova',
      symbol: '♒',
      date_range: '20 Oca - 18 Şub',
      ruling_planet: 'Satürn/Uranüs',
      element: 'Hava',
      quality: 'Sabit',
      keywords: ['Özgün', 'İnsancıl', 'Bağımsız']
    },
    {
      id: 12,
      name: 'Balık',
      symbol: '♓',
      date_range: '19 Şub - 20 Mar',
      ruling_planet: 'Jüpiter/Neptün',
      element: 'Su',
      quality: 'Değişken',
      keywords: ['Empatik', 'Yaratıcı', 'Sezgisel']
    }
  ];

  useEffect(() => {
    fetchZodiacSigns();
  }, []);

  const fetchZodiacSigns = async () => {
    try {
      setLoading(true);
      
      // For now, use mock data. Later implement Supabase call:
      // const { data, error } = await supabase
      //   .from('zodiac_signs')
      //   .select('id, name, symbol, date_range, ruling_planet, element, quality, keywords')
      //   .order('id');
      
      // if (error) throw error;
      // setZodiacs(data || []);
      
      // Simulate API call delay
      setTimeout(() => {
        setZodiacs(mockZodiacData);
        setLoading(false);
      }, 1000);
      
    } catch (error) {
      console.error('Error fetching zodiac signs:', error);
      setLoading(false);
    }
  };

  const handleZodiacPress = (sign: ZodiacSign) => {
    navigation.navigate('ZodiacDetail', { sign });
  };

  const renderZodiacCard = ({ item }: { item: ZodiacSign }) => (
    <ZodiacGridCard
      sign={item}
      onPress={() => handleZodiacPress(item)}
    />
  );

  if (loading) {
    return (
      <LinearGradient
        colors={['#0A092D', '#1a1a3e', '#2a2a5e']}
        style={styles.loadingContainer}
      >
        <ActivityIndicator size="large" color="#FFD700" />
        <Text style={styles.loadingText}>Burçlar Yükleniyor...</Text>
      </LinearGradient>
    );
  }

  return (
    <LinearGradient
      colors={['#0A092D', '#1a1a3e', '#2a2a5e']}
      style={styles.container}
    >
      <StatusBar barStyle="light-content" backgroundColor="#0A092D" />
      
      <SafeAreaView style={styles.safeArea}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Burçlar</Text>
          <Text style={styles.subtitle}>
            12 burç arasından seçim yapın
          </Text>
        </View>

        {/* Zodiac Grid */}
        <FlatList
          data={zodiacs}
          renderItem={renderZodiacCard}
          keyExtractor={(item) => item.id.toString()}
          numColumns={2}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.gridContainer}
          columnWrapperStyle={styles.row}
        />
      </SafeAreaView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: '#FFFFFF',
    fontSize: 16,
    marginTop: 15,
  },
  safeArea: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    color: '#B0B0B0',
    textAlign: 'center',
  },
  gridContainer: {
    paddingHorizontal: 12,
    paddingTop: 20,
    paddingBottom: 40,
  },
  row: {
    justifyContent: 'space-around',
  },
});

export default ZodiacListPage;