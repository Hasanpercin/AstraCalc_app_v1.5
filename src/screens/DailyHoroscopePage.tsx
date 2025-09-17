// src/screens/DailyHoroscopePage.tsx
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  ScrollView,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { LinearGradient } from 'expo-linear-gradient';

import { ZodiacStackParamList, DailyHoroscope, HoroscopeTabParamList } from '../types/zodiac';
import { supabase } from '../lib/supabaseClient';

type DailyHoroscopeRouteProp = RouteProp<ZodiacStackParamList, 'DailyHoroscope'>;
type DailyHoroscopeNavigationProp = NativeStackNavigationProp<ZodiacStackParamList, 'DailyHoroscope'>;

const Tab = createMaterialTopTabNavigator();
const { width } = Dimensions.get('window');

// Sekme içerik bileşenleri
const GeneralTab: React.FC<{ horoscope: DailyHoroscope | null }> = ({ horoscope }) => (
  <ScrollView style={styles.tabContent}>
    <LinearGradient
      colors={['rgba(255, 215, 0, 0.1)', 'rgba(255, 165, 0, 0.05)']}
      style={styles.contentCard}
    >
      <Text style={styles.contentText}>
        {horoscope?.general_overview || 'Günlük genel bakış bilgisi yükleniyor...'}
      </Text>
    </LinearGradient>
  </ScrollView>
);

const LoveTab: React.FC<{ horoscope: DailyHoroscope | null }> = ({ horoscope }) => (
  <ScrollView style={styles.tabContent}>
    <LinearGradient
      colors={['rgba(255, 105, 180, 0.1)', 'rgba(255, 20, 147, 0.05)']}
      style={styles.contentCard}
    >
      <Text style={styles.contentText}>
        {horoscope?.love_commentary || 'Aşk hayatınızla ilgili yorumlar yükleniyor...'}
      </Text>
    </LinearGradient>
  </ScrollView>
);

const CareerTab: React.FC<{ horoscope: DailyHoroscope | null }> = ({ horoscope }) => (
  <ScrollView style={styles.tabContent}>
    <LinearGradient
      colors={['rgba(34, 197, 94, 0.1)', 'rgba(16, 185, 129, 0.05)']}
      style={styles.contentCard}
    >
      <Text style={styles.contentText}>
        {horoscope?.career_commentary || 'Kariyer yorumlarınız yükleniyor...'}
      </Text>
    </LinearGradient>
  </ScrollView>
);

const HealthTab: React.FC<{ horoscope: DailyHoroscope | null }> = ({ horoscope }) => (
  <ScrollView style={styles.tabContent}>
    <LinearGradient
      colors={['rgba(59, 130, 246, 0.1)', 'rgba(37, 99, 235, 0.05)']}
      style={styles.contentCard}
    >
      <Text style={styles.contentText}>
        {horoscope?.health_commentary || 'Sağlık yorumlarınız yükleniyor...'}
      </Text>
    </LinearGradient>
  </ScrollView>
);

const DailyHoroscopePage: React.FC = () => {
  const route = useRoute<DailyHoroscopeRouteProp>();
  const navigation = useNavigation<DailyHoroscopeNavigationProp>();
  const { sign } = route.params;

  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [horoscope, setHoroscope] = useState<DailyHoroscope | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  // Mock horoscope data
  const mockHoroscope: DailyHoroscope = {
    id: 1,
    sign_id: sign.id,
    date: selectedDate,
    general_overview: `${sign.name} burcu için bugün enerjiniz yüksek. Yeni projelere başlamak için uygun bir gün. ${sign.element} elementinin etkisiyle yaratıcılığınız öne çıkıyor.`,
    love_commentary: `Aşk hayatınızda pozitif gelişmeler olabilir. ${sign.ruling_planet} gezegeninin etkisiyle duygusal bağlarınız güçleniyor. Partnernizle iletişimde açık olun.`,
    career_commentary: `Kariyerinizde önemli fırsatlar kapınızı çalabilir. ${sign.quality} niteliğiniz sayesinde zorluklarla başa çıkmakta başarılı olacaksınız. İş birliklerine odaklanın.`,
    health_commentary: `Sağlığınıza dikkat edin ve düzenli beslenin. ${sign.element} elementinin etkisiyle vücut enerjiniz dengelenmeye ihtiyaç duyuyor. Dinlenmeyi ihmal etmeyin.`
  };

  useEffect(() => {
    fetchHoroscope();
  }, [selectedDate]);

  const fetchHoroscope = async () => {
    try {
      setLoading(true);
      
      // For now, use mock data. Later implement Supabase call:
      // const { data, error } = await supabase
      //   .from('daily_horoscopes')
      //   .select('*')
      //   .eq('sign_id', sign.id)
      //   .eq('date', selectedDate)
      //   .single();
      
      // if (error) throw error;
      // setHoroscope(data);
      
      // Simulate API call delay
      setTimeout(() => {
        setHoroscope(mockHoroscope);
        setLoading(false);
      }, 800);
      
    } catch (error) {
      console.error('Error fetching horoscope:', error);
      setLoading(false);
    }
  };

  const handleGoBack = () => {
    navigation.goBack();
  };

  // Basit tarih seçici oluştur
  const generateDateOptions = () => {
    const dates = [];
    const today = new Date();
    
    for (let i = -7; i <= 7; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      dates.push({
        date: date.toISOString().split('T')[0],
        day: date.getDate(),
        month: date.toLocaleDateString('tr-TR', { month: 'short' }),
        isToday: i === 0
      });
    }
    return dates;
  };

  const dateOptions = generateDateOptions();

  return (
    <LinearGradient
      colors={['#0A092D', '#1a1a3e', '#2a2a5e']}
      style={styles.container}
    >
      <StatusBar barStyle="light-content" backgroundColor="#0A092D" />
      
      <SafeAreaView style={styles.safeArea}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={handleGoBack} style={styles.backButton}>
            <Text style={styles.backIcon}>←</Text>
          </TouchableOpacity>
          <View style={styles.headerContent}>
            <Text style={styles.signName}>{sign.name}</Text>
            <Text style={styles.headerSubtitle}>Burcu Günlük Etkinlikleri</Text>
          </View>
          <View style={styles.placeholder} />
        </View>

        {/* Tarih Seçici */}
        <View style={styles.dateContainer}>
          <Text style={styles.dateTitle}>Ekim 2024</Text>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.dateScrollContent}
          >
            {dateOptions.map((dateOption, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.dateItem,
                  selectedDate === dateOption.date && styles.selectedDateItem,
                  dateOption.isToday && styles.todayDateItem
                ]}
                onPress={() => setSelectedDate(dateOption.date)}
              >
                <Text style={[
                  styles.dayText,
                  selectedDate === dateOption.date && styles.selectedDayText
                ]}>
                  {dateOption.day}
                </Text>
                <Text style={[
                  styles.monthText,
                  selectedDate === dateOption.date && styles.selectedMonthText
                ]}>
                  {dateOption.month}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Balık ve Koç Uyum Bilgisi */}
        <View style={styles.compatibilityContainer}>
          <Text style={styles.compatibilityTitle}>Balık ve Koç</Text>
          <Text style={styles.compatibilityText}>
            Bugün Balık ve Koç arasında güçlü bir çekim var. 
            Bu iki burç birbirini hem çekiyor hem de rahatlık verici bir etki oluşturuyor.
          </Text>
        </View>

        {/* Sekmeli İçerik */}
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#FFD700" />
            <Text style={styles.loadingText}>Günlük yorum yükleniyor...</Text>
          </View>
        ) : (
          <View style={styles.tabContainer}>
            <Tab.Navigator
              // @ts-ignore - React Navigation v7 ID requirement workaround
              screenOptions={{
                tabBarStyle: styles.tabBar,
                tabBarActiveTintColor: '#FFD700',
                tabBarInactiveTintColor: '#B0B0B0',
                tabBarIndicatorStyle: styles.tabIndicator,
                tabBarLabelStyle: styles.tabLabel,
                tabBarScrollEnabled: true,
                tabBarItemStyle: styles.tabItem,
              }}
            >
              <Tab.Screen 
                name="General" 
                options={{ title: 'Genel Bakış' }}
                children={() => <GeneralTab horoscope={horoscope} />}
              />
              <Tab.Screen 
                name="Love" 
                options={{ title: 'Aşk' }}
                children={() => <LoveTab horoscope={horoscope} />}
              />
              <Tab.Screen 
                name="Career" 
                options={{ title: 'Kariyer' }}
                children={() => <CareerTab horoscope={horoscope} />}
              />
              <Tab.Screen 
                name="Health" 
                options={{ title: 'Sağlık' }}
                children={() => <HealthTab horoscope={horoscope} />}
              />
            </Tab.Navigator>
          </View>
        )}
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
    fontSize: 20,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  headerContent: {
    alignItems: 'center',
  },
  signName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  headerSubtitle: {
    fontSize: 12,
    color: '#B0B0B0',
    marginTop: 2,
  },
  placeholder: {
    width: 40,
  },
  dateContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  dateTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 15,
    textAlign: 'center',
  },
  dateScrollContent: {
    paddingHorizontal: 10,
  },
  dateItem: {
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginHorizontal: 4,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
  },
  selectedDateItem: {
    backgroundColor: '#8B5CF6',
  },
  todayDateItem: {
    borderWidth: 2,
    borderColor: '#FFD700',
  },
  dayText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  selectedDayText: {
    color: '#FFFFFF',
  },
  monthText: {
    fontSize: 12,
    color: '#B0B0B0',
    marginTop: 2,
  },
  selectedMonthText: {
    color: '#FFFFFF',
  },
  compatibilityContainer: {
    marginHorizontal: 20,
    padding: 20,
    backgroundColor: 'rgba(139, 92, 246, 0.1)',
    borderRadius: 15,
    borderWidth: 1,
    borderColor: 'rgba(139, 92, 246, 0.3)',
    marginBottom: 20,
  },
  compatibilityTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  compatibilityText: {
    fontSize: 14,
    color: '#B0B0B0',
    lineHeight: 20,
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
  tabContainer: {
    flex: 1,
  },
  tabBar: {
    backgroundColor: 'rgba(20, 19, 61, 0.9)',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 215, 0, 0.2)',
  },
  tabIndicator: {
    backgroundColor: '#FFD700',
    height: 3,
  },
  tabLabel: {
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'none',
  },
  tabItem: {
    width: width / 4,
  },
  tabContent: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  contentCard: {
    margin: 20,
    padding: 20,
    borderRadius: 15,
    backgroundColor: 'rgba(20, 19, 61, 0.9)',
    borderWidth: 1,
    borderColor: 'rgba(255, 215, 0, 0.2)',
  },
  contentText: {
    fontSize: 16,
    color: '#FFFFFF',
    lineHeight: 24,
    textAlign: 'justify',
  },
});

export default DailyHoroscopePage;