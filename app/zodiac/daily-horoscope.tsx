import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { ArrowLeft, Heart, Star } from 'lucide-react-native';
import { ZodiacService } from '@/services/zodiacService';

const { width } = Dimensions.get('window');

const months = [
  'Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran',
  'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'
];

const dayNames = ['Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt', 'Paz'];

interface TabData {
  id: string;
  title: string;
  color: string;
}

const tabs: TabData[] = [
  { id: 'general', title: 'Genel Bakış', color: '#8B5CF6' },
  { id: 'love', title: 'Aşk', color: '#EF4444' },
  { id: 'career', title: 'Kariyer', color: '#10B981' },
  { id: 'friendship', title: 'Arkadaşlık', color: '#F59E0B' },
  { id: 'health', title: 'Sağlık', color: '#06B6D4' },
];

export default function DailyHoroscopeScreen() {
  const router = useRouter();
  const { sign, name } = useLocalSearchParams();
  
  const [data, setData] = useState<any>(null);
  const [horoscope, setHoroscope] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('general');
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [isCalendarExpanded, setIsCalendarExpanded] = useState(false);

  useEffect(() => {
    loadZodiacData();
  }, []);

  useEffect(() => {
    if (data) {
      loadHoroscope();
    }
  }, [selectedDate, data]);

  const loadZodiacData = async () => {
    try {
      setLoading(true);
      const zodiacKey = (sign as string)?.toLowerCase();
      const zodiacData = await ZodiacService.getZodiacSign(zodiacKey);
      
      console.log('Daily Horoscope Debug:', {
        sign,
        name,
        zodiacKey,
        dataFound: !!zodiacData
      });
      
      setData(zodiacData);
    } catch (error) {
      console.error('Error loading zodiac data:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadHoroscope = async () => {
    try {
      const zodiacKey = (sign as string)?.toLowerCase();
      const horoscopeData = await ZodiacService.generateDailyHoroscope(zodiacKey, selectedDate);
      setHoroscope(horoscopeData);
    } catch (error) {
      console.error('Error loading horoscope:', error);
    }
  };

  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    // JavaScript: Sunday=0, Monday=1, ..., Saturday=6
    // Türkçe takvim: Pazartesi=0, Salı=1, ..., Pazar=6
    const day = new Date(date.getFullYear(), date.getMonth(), 1).getDay();
    return day === 0 ? 6 : day - 1; // Pazar (0) -> 6, Pazartesi (1) -> 0
  };

  const changeMonth = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate);
    if (direction === 'prev') {
      newDate.setMonth(newDate.getMonth() - 1);
    } else {
      newDate.setMonth(newDate.getMonth() + 1);
    }
    setCurrentDate(newDate);
  };

  const renderCalendar = () => {
    const daysInMonth = getDaysInMonth(currentDate);
    const firstDay = getFirstDayOfMonth(currentDate);
    const days = [];

    // Empty cells for days before month starts
    for (let i = 0; i < firstDay; i++) {
      days.push(<View key={`empty-${i}`} style={styles.calendarDay} />);
    }

    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const isSelected = selectedDate.getDate() === day && 
                        selectedDate.getMonth() === currentDate.getMonth() &&
                        selectedDate.getFullYear() === currentDate.getFullYear();
      const isToday = new Date().getDate() === day && 
                     new Date().getMonth() === currentDate.getMonth() &&
                     new Date().getFullYear() === currentDate.getFullYear();

      days.push(
        <TouchableOpacity
          key={day}
          style={[
            styles.calendarDay,
            isSelected && styles.selectedDay,
            isToday && styles.todayDay,
          ]}
          onPress={() => {
            const newDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
            setSelectedDate(newDate);
          }}
        >
          <Text style={[
            styles.calendarDayText,
            isSelected && styles.selectedDayText,
            isToday && styles.todayDayText,
          ]}>
            {day}
          </Text>
        </TouchableOpacity>
      );
    }

    return days;
  };

  const getTabContent = () => {
    const zodiacName = data?.name || 'Burç';
    const element = data?.element || 'element';
    const rulingPlanet = data?.ruling_planet || 'gezegen';
    
    switch (activeTab) {
      case 'general':
        return {
          icon: <Star size={20} color="#8B5CF6" />,
          title: 'Genel Bakış',
          content: horoscope?.generalFortune || `${zodiacName} burcu için bugün enerjiniz dengeli ve huzurlu. ${element} elementinin etkisiyle doğal yetenekleriniz öne çıkıyor. ${rulingPlanet} gezegeninin olumlu enerjisi, bugün size yaratıcı fikirler ve yeni başlangıçlar için cesaret veriyor. Kendinize güvenin ve içsel sesinizi dinleyin.`,
          tips: [
            '💫 Sabah meditasyonu yaparak güne başlayın',
            '✨ Yeni bir hobiye veya ilgi alanına zaman ayırın',
            '🎯 Uzun vadeli hedeflerinizi gözden geçirin',
            '🌟 Kendinize küçük ödüller verin'
          ],
          luckyColor: data?.lucky_colors?.[0] || 'Mor',
          luckyNumber: data?.lucky_numbers?.[0] || 7
        };
      case 'love':
        return {
          icon: <Heart size={20} color="#EF4444" />,
          title: 'Aşk & İlişkiler',
          content: horoscope?.loveFortune || `Aşk hayatınızda bugün ${rulingPlanet} gezegeninin etkisiyle duygusal bağlarınız güçleniyor. Bekarsanız, yeni tanışmalar için uygun bir gün. İlişkideyseniz, partnerinizle derin ve anlamlı konuşmalar yapın. ${element} enerjisi, duygularınızı ifade etmenizi kolaylaştırıyor.`,
          tips: [
            '💕 Sevdiklerinize zaman ayırın ve ilgi gösterin',
            '💖 Duygularınızı açıkça ifade edin',
            '🌹 Romantik bir jest yapın veya sürpriz hazırlayın',
            '💝 Geçmiş anıları hatırlayın ve paylaşın'
          ],
          luckyColor: 'Pembe',
          luckyNumber: data?.lucky_numbers?.[1] || 2
        };
      case 'career':
        return {
          icon: <Star size={20} color="#10B981" />,
          title: 'Kariyer & İş Hayatı',
          content: horoscope?.careerFortune || `Kariyerinizde bugün ${zodiacName} burcunun kararlılığı öne çıkıyor. ${rulingPlanet} gezegeninin desteğiyle profesyonel hayatınızda yeni fırsatlar kapınızı çalabilir. İş birliklerine açık olun ve fikirlerinizi cesaretle paylaşın. ${element} elementinin enerjisi, yaratıcı çözümler bulmanıza yardımcı oluyor.`,
          tips: [
            '💼 Önemli projelere öncelik verin',
            '🎓 Yeni beceriler öğrenmek için zaman ayırın',
            '🤝 Meslektaşlarınızla networking yapın',
            '📊 Hedeflerinizi yazılı hale getirin'
          ],
          luckyColor: 'Yeşil',
          luckyNumber: data?.lucky_numbers?.[2] || 8
        };
      case 'friendship':
        return {
          icon: <Star size={20} color="#F59E0B" />,
          title: 'Arkadaşlık & Sosyal Hayat',
          content: `Bugün sosyal enerjiniz yüksek! ${zodiacName} burcu olarak, arkadaşlarınızla kaliteli zaman geçirmek size iyi gelecek. ${element} elementinin etkisiyle iletişim kanallarınız açık ve samimi. Yeni insanlarla tanışmak veya eski dostlarınızla bağları güçlendirmek için ideal bir gün.`,
          tips: [
            '🎉 Grup aktivitelerine katılın',
            '☕ Eski bir arkadaşınızla kahve içmeye çıkın',
            '🎮 Ortak hobiler paylaşın',
            '💬 Dijital detoks yapıp yüz yüze görüşün'
          ],
          luckyColor: 'Turuncu',
          luckyNumber: 3
        };
      case 'health':
        return {
          icon: <Star size={20} color="#06B6D4" />,
          title: 'Sağlık & Wellness',
          content: horoscope?.healthFortune || `Sağlığınıza bugün özel dikkat gösterin. ${element} elementi, vücut enerjinizin dengeye ihtiyaç duyduğunu gösteriyor. Düzenli beslenme, bol su tüketimi ve hafif egzersiz yaparak kendinizi iyi hissedeceksiniz. ${rulingPlanet} gezegeninin etkisiyle zihinsel sağlığınız da önem kazanıyor.`,
          tips: [
            '🧘‍♀️ Yoga veya meditasyon yapın',
            '💧 Günde en az 8 bardak su için',
            '🥗 Taze ve doğal gıdalar tüketin',
            '😴 Düzenli uyku rutini oluşturun'
          ],
          luckyColor: 'Mavi',
          luckyNumber: 9
        };
      default:
        return {
          icon: <Star size={20} color="#8B5CF6" />,
          title: 'Genel',
          content: 'Genel bilgi mevcut değil.',
          tips: [],
          luckyColor: 'Mor',
          luckyNumber: 7
        };
    }
  };

  if (loading) {
    return (
      <LinearGradient colors={['#1E1B4B', '#312E81']} style={styles.container}>
        <View style={styles.errorContainer}>
          <ActivityIndicator size="large" color="#FFFFFF" />
          <Text style={styles.errorText}>Yükleniyor...</Text>
        </View>
      </LinearGradient>
    );
  }

  if (!data) {
    return (
      <LinearGradient colors={['#1E1B4B', '#312E81']} style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Burç bilgisi bulunamadı</Text>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <Text style={styles.backButtonText}>Geri Dön</Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>
    );
  }

  const tabContent = getTabContent();

  return (
    <LinearGradient colors={['#1E1B4B', '#312E81']} style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.headerBackButton} onPress={() => router.back()}>
            <ArrowLeft size={24} color="#FFFFFF" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{data.symbol} {data.name}</Text>
        </View>

        {/* Tab Navigation */}
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          style={styles.tabContainer}
        >
          {tabs.map((tab) => (
            <TouchableOpacity
              key={tab.id}
              style={[
                styles.tab,
                activeTab === tab.id && { backgroundColor: tab.color }
              ]}
              onPress={() => setActiveTab(tab.id)}
            >
              <Text style={[
                styles.tabText,
                activeTab === tab.id && styles.activeTabText
              ]}>
                {tab.title}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Title */}
        <Text style={styles.screenTitle}>{data.name} Burcu Günlük Etkileşimler</Text>

        {/* Calendar - Collapsible */}
        <View style={styles.calendarContainer}>
          <TouchableOpacity 
            style={styles.calendarHeaderCollapsible}
            onPress={() => setIsCalendarExpanded(!isCalendarExpanded)}
            activeOpacity={0.8}
          >
            <View style={styles.calendarHeaderLeft}>
              <Text style={styles.calendarIcon}>📅</Text>
              <View>
                <Text style={styles.selectedDateText}>
                  {selectedDate.getDate()} {months[selectedDate.getMonth()]} {selectedDate.getFullYear()}
                </Text>
                {!isCalendarExpanded && (
                  <Text style={styles.tapToSelectText}>Tarih seçmek için tıklayın</Text>
                )}
              </View>
            </View>
            <Text style={[styles.chevronText, isCalendarExpanded && styles.chevronExpanded]}>
              {isCalendarExpanded ? '▼' : '▶'}
            </Text>
          </TouchableOpacity>

          {isCalendarExpanded && (
            <>
              <View style={styles.calendarMonthNavigation}>
                <TouchableOpacity onPress={() => changeMonth('prev')}>
                  <Text style={styles.chevronText}>◀</Text>
                </TouchableOpacity>
                <Text style={styles.monthYear}>
                  {months[currentDate.getMonth()]} {currentDate.getFullYear()}
                </Text>
                <TouchableOpacity onPress={() => changeMonth('next')}>
                  <Text style={styles.chevronText}>▶</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.weekDays}>
                {dayNames.map((day, index) => (
                  <Text key={`day-${index}`} style={styles.weekDayText}>{day}</Text>
                ))}
              </View>

              <View style={styles.calendarGrid}>
                {renderCalendar()}
              </View>
            </>
          )}
        </View>

        {/* Daily Content */}
        <View style={styles.contentContainer}>
          <View style={styles.contentHeader}>
            {tabContent.icon}
            <Text style={styles.contentTitle}>{tabContent.title}</Text>
          </View>
          <Text style={styles.contentText}>{tabContent.content}</Text>
          
          {/* Lucky Info */}
          {tabContent.luckyColor && (
            <View style={styles.luckyInfoContainer}>
              <View style={styles.luckyItem}>
                <Text style={styles.luckyLabel}>🎨 Şanslı Renk:</Text>
                <Text style={styles.luckyValue}>{tabContent.luckyColor}</Text>
              </View>
              <View style={styles.luckyItem}>
                <Text style={styles.luckyLabel}>🔢 Şanslı Sayı:</Text>
                <Text style={styles.luckyValue}>{tabContent.luckyNumber}</Text>
              </View>
            </View>
          )}

          {/* Tips */}
          {tabContent.tips && tabContent.tips.length > 0 && (
            <View style={styles.tipsContainer}>
              <Text style={styles.tipsTitle}>💡 Günün Önerileri</Text>
              {tabContent.tips.map((tip, index) => (
                <View key={`tip-${index}`} style={styles.tipItem}>
                  <Text style={styles.tipText}>{tip}</Text>
                </View>
              ))}
            </View>
          )}
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
  tabContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  tab: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    marginRight: 10,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  tabText: {
    color: '#94A3B8',
    fontSize: 14,
    fontWeight: '500',
  },
  activeTabText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  screenTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 20,
    paddingHorizontal: 20,
  },
  calendarContainer: {
    backgroundColor: 'rgba(30, 41, 59, 0.8)',
    marginHorizontal: 20,
    marginBottom: 20,
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#334155',
  },
  calendarHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  calendarHeaderCollapsible: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
    backgroundColor: 'rgba(139, 92, 246, 0.15)',
    borderRadius: 12,
    marginBottom: 16,
  },
  calendarHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  calendarIcon: {
    fontSize: 28,
  },
  selectedDateText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  tapToSelectText: {
    fontSize: 12,
    color: '#94A3B8',
    marginTop: 2,
  },
  chevronExpanded: {
    transform: [{ rotate: '0deg' }],
  },
  calendarMonthNavigation: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    paddingHorizontal: 20,
  },
  monthYear: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  chevronText: {
    fontSize: 24,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  weekDays: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 10,
  },
  weekDayText: {
    fontSize: 14,
    color: '#94A3B8',
    fontWeight: '500',
    width: (width - 80) / 7,
    textAlign: 'center',
  },
  calendarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  calendarDay: {
    width: (width - 80) / 7,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 5,
  },
  selectedDay: {
    backgroundColor: '#8B5CF6',
    borderRadius: 20,
  },
  todayDay: {
    backgroundColor: 'rgba(139, 92, 246, 0.3)',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#8B5CF6',
  },
  calendarDayText: {
    fontSize: 14,
    color: '#E2E8F0',
  },
  selectedDayText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  todayDayText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  contentContainer: {
    backgroundColor: 'rgba(30, 41, 59, 0.8)',
    marginHorizontal: 20,
    marginBottom: 20,
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#334155',
  },
  contentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 8,
  },
  contentTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  contentText: {
    fontSize: 16,
    color: '#E2E8F0',
    lineHeight: 24,
    marginBottom: 16,
  },
  luckyInfoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: 'rgba(139, 92, 246, 0.1)',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(139, 92, 246, 0.3)',
  },
  luckyItem: {
    alignItems: 'center',
  },
  luckyLabel: {
    fontSize: 14,
    color: '#94A3B8',
    marginBottom: 4,
  },
  luckyValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  tipsContainer: {
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.3)',
  },
  tipsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 12,
  },
  tipItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
    paddingLeft: 8,
  },
  tipText: {
    fontSize: 14,
    color: '#E2E8F0',
    lineHeight: 20,
    flex: 1,
  },
  bottomSpacing: {
    height: 40,
  },
});
