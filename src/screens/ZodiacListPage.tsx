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

  useEffect(() => {
    fetchZodiacSigns();
  }, []);

  const fetchZodiacSigns = async () => {
    try {
      setLoading(true);
      
      if (!supabase) {
        console.warn('Supabase not configured');
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from('zodiac_signs')
        .select('*')
        .order('id', { ascending: true });

      if (error) {
        console.error('Error fetching zodiac signs:', error);
        setLoading(false);
        return;
      }

      if (data && data.length > 0) {
        setZodiacs(data as ZodiacSign[]);
      }
    } catch (error) {
      console.error('Exception fetching zodiac signs:', error);
    } finally {
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