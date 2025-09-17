import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { ArrowLeft, ChevronLeft, ChevronRight, Heart, Star } from 'lucide-react-native';
import { ZodiacService } from '@/services/zodiacService';

const { width } = Dimensions.get('window');

const months = [
  'Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran',
  'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'
];

const dayNames = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

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
  
  const zodiacKey = (sign as string)?.toLowerCase();
  const data = ZodiacService.getZodiacSign(zodiacKey);

  // Debug için
  console.log('Daily Horoscope Debug:', {
    sign,
    name,
    zodiacKey,
    dataFound: !!data
  });

  const [activeTab, setActiveTab] = useState('general');
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());

  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
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
    const horoscope = ZodiacService.generateDailyHoroscope(zodiacKey, selectedDate);
    
    switch (activeTab) {
      case 'general':
        return {
          icon: <Star size={20} color="#8B5CF6" />,
          title: 'Genel Bakış',
          content: horoscope?.generalFortune || 'Bugün enerjiniz yüksek. Yeni projelere başlamak için ideal bir gün.'
        };
      case 'love':
        return {
          icon: <Heart size={20} color="#EF4444" />,
          title: 'Aşk',
          content: horoscope?.loveFortune || 'Aşk hayatınızda pozitif gelişmeler yaşayabilirsiniz. İletişime özen gösterin.'
        };
      case 'career':
        return {
          icon: <Star size={20} color="#10B981" />,
          title: 'Kariyer',
          content: horoscope?.careerFortune || 'Kariyerinizde yeni fırsatlar doğabilir. Sabırlı olun ve planlarınızı gözden geçirin.'
        };
      case 'friendship':
        return {
          icon: <Star size={20} color="#F59E0B" />,
          title: 'Arkadaşlık',
          content: 'Arkadaşlarınızla güzel anlar geçirebilirsiniz. Sosyal etkinliklere katılmak size iyi gelecek.'
        };
      case 'health':
        return {
          icon: <Star size={20} color="#06B6D4" />,
          title: 'Sağlık',
          content: horoscope?.healthFortune || 'Sağlığınıza dikkat edin. Düzenli beslenme ve egzersiz yapmayı ihmal etmeyin.'
        };
      default:
        return {
          icon: <Star size={20} color="#8B5CF6" />,
          title: 'Genel',
          content: 'Genel bilgi mevcut değil.'
        };
    }
  };

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

        {/* Calendar */}
        <View style={styles.calendarContainer}>
          <View style={styles.calendarHeader}>
            <TouchableOpacity onPress={() => changeMonth('prev')}>
              <ChevronLeft size={24} color="#FFFFFF" />
            </TouchableOpacity>
            <Text style={styles.monthYear}>
              {months[currentDate.getMonth()]} {currentDate.getFullYear()}
            </Text>
            <TouchableOpacity onPress={() => changeMonth('next')}>
              <ChevronRight size={24} color="#FFFFFF" />
            </TouchableOpacity>
          </View>

          <View style={styles.weekDays}>
            {dayNames.map((day) => (
              <Text key={day} style={styles.weekDayText}>{day}</Text>
            ))}
          </View>

          <View style={styles.calendarGrid}>
            {renderCalendar()}
          </View>
        </View>

        {/* Compatibility Section */}
        <View style={styles.compatibilitySection}>
          <Text style={styles.compatibilityTitle}>{data.name} ve Koç</Text>
          <Text style={styles.compatibilitySubtitle}>
            Bugün, {data.name} ve Koç arasında enerjik bir uyum var. Ortak projelerde başarılı olabilirler.
          </Text>
          
          <Text style={[styles.compatibilityTitle, { marginTop: 20 }]}>
            {data.name} ve Boğa
          </Text>
          <Text style={styles.compatibilitySubtitle}>
            {data.name} ve Boğa, bugün duygusal konularda derinleşebilir, birbirlerine destek olabilirler.
          </Text>

          <Text style={[styles.compatibilityTitle, { marginTop: 20 }]}>
            {data.name} ve İkizler
          </Text>
          <Text style={styles.compatibilitySubtitle}>
            {data.name} ve İkizler arasında iletişimde bazı zorluklar yaşanabilir, dikkatli olunmalı.
          </Text>
        </View>

        {/* Daily Content */}
        <View style={styles.contentContainer}>
          <View style={styles.contentHeader}>
            {tabContent.icon}
            <Text style={styles.contentTitle}>{tabContent.title}</Text>
          </View>
          <Text style={styles.contentText}>{tabContent.content}</Text>
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
  monthYear: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
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
  compatibilitySection: {
    backgroundColor: 'rgba(30, 41, 59, 0.8)',
    marginHorizontal: 20,
    marginBottom: 20,
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#334155',
  },
  compatibilityTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  compatibilitySubtitle: {
    fontSize: 14,
    color: '#94A3B8',
    lineHeight: 20,
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
  },
  bottomSpacing: {
    height: 40,
  },
});
