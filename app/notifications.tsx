import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  FlatList,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { ArrowLeft, Bell, Circle, CircleCheck as CheckCircle, Trash2, Filter, Calendar, Star, MessageCircle } from 'lucide-react-native';

interface Notification {
  id: string;
  title: string;
  message: string;
  category: 'horoscope' | 'ai_chat' | 'system' | 'birth_chart';
  timestamp: Date;
  read: boolean;
  priority: 'low' | 'medium' | 'high';
}

export default function NotificationsScreen() {
  const router = useRouter();
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: '1',
      title: 'Günlük Yorumunuz Hazır',
      message: 'Bugün için özel astroloji yorumunuz hazırlandı. Hemen inceleyin!',
      category: 'horoscope',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
      read: false,
      priority: 'high'
    },
    {
      id: '2',
      title: 'AI Sohbet Yanıtınız',
      message: 'Sorduğunuz "Mars retrosu nasıl etkiler?" sorunuza yanıt verildi.',
      category: 'ai_chat',
      timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000), // 5 hours ago
      read: true,
      priority: 'medium'
    },
    {
      id: '3',
      title: 'Doğum Haritası Güncellendi',
      message: 'Doğum harita bilgileriniz başarıyla güncellendi ve yeniden hesaplandı.',
      category: 'birth_chart',
      timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
      read: true,
      priority: 'medium'
    },
    {
      id: '4',
      title: 'Sistem Güncellemesi',
      message: 'Astrocalc uygulaması v1.0.1 sürümüne güncellendi. Yeni özellikler eklendi.',
      category: 'system',
      timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
      read: false,
      priority: 'low'
    }
  ]);
  
  const [selectedFilter, setSelectedFilter] = useState<string>('all');

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'horoscope':
        return <Star size={20} color="#F59E0B" />;
      case 'ai_chat':
        return <MessageCircle size={20} color="#8B5CF6" />;
      case 'birth_chart':
        return <Circle size={20} color="#10B981" />;
      case 'system':
        return <Bell size={20} color="#3B82F6" />;
      default:
        return <Bell size={20} color="#64748B" />;
    }
  };

  const getCategoryName = (category: string) => {
    switch (category) {
      case 'horoscope':
        return 'Günlük Yorum';
      case 'ai_chat':
        return 'AI Sohbet';
      case 'birth_chart':
        return 'Doğum Haritası';
      case 'system':
        return 'Sistem';
      default:
        return 'Genel';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return '#EF4444';
      case 'medium':
        return '#F59E0B';
      case 'low':
        return '#10B981';
      default:
        return '#64748B';
    }
  };

  const markAsRead = (id: string) => {
    setNotifications(prev =>
      prev.map(notif =>
        notif.id === id ? { ...notif, read: true } : notif
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev =>
      prev.map(notif => ({ ...notif, read: true }))
    );
  };

  const deleteNotification = (id: string) => {
    Alert.alert(
      'Bildirim Sil',
      'Bu bildirimi silmek istediğinizden emin misiniz?',
      [
        { text: 'İptal', style: 'cancel' },
        {
          text: 'Sil',
          style: 'destructive',
          onPress: () => {
            setNotifications(prev => prev.filter(notif => notif.id !== id));
          }
        }
      ]
    );
  };

  const clearAllNotifications = () => {
    Alert.alert(
      'Tüm Bildirimleri Temizle',
      'Tüm bildirimleri silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.',
      [
        { text: 'İptal', style: 'cancel' },
        {
          text: 'Temizle',
          style: 'destructive',
          onPress: () => setNotifications([])
        }
      ]
    );
  };

  const filteredNotifications = notifications.filter(notif => {
    if (selectedFilter === 'all') return true;
    if (selectedFilter === 'unread') return !notif.read;
    return notif.category === selectedFilter;
  });

  const formatTime = (date: Date) => {
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) {
      const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
      return `${diffInMinutes} dakika önce`;
    } else if (diffInHours < 24) {
      return `${diffInHours} saat önce`;
    } else {
      const diffInDays = Math.floor(diffInHours / 24);
      return `${diffInDays} gün önce`;
    }
  };

  const renderNotificationItem = ({ item }: { item: Notification }) => (
    <TouchableOpacity
      style={[
        styles.notificationCard,
        !item.read && styles.unreadCard
      ]}
      onPress={() => markAsRead(item.id)}
    >
      <View style={styles.notificationHeader}>
        <View style={styles.notificationLeft}>
          {getCategoryIcon(item.category)}
          <View style={styles.notificationInfo}>
            <Text style={[styles.notificationTitle, !item.read && styles.unreadTitle]}>
              {item.title}
            </Text>
            <Text style={styles.notificationCategory}>
              {getCategoryName(item.category)}
            </Text>
          </View>
        </View>
        <View style={styles.notificationRight}>
          {!item.read && (
            <View style={[styles.priorityDot, { backgroundColor: getPriorityColor(item.priority) }]} />
          )}
          <TouchableOpacity
            style={styles.deleteButton}
            onPress={() => deleteNotification(item.id)}
          >
            <Trash2 size={16} color="#EF4444" />
          </TouchableOpacity>
        </View>
      </View>
      
      <Text style={styles.notificationMessage}>{item.message}</Text>
      
      <View style={styles.notificationFooter}>
        <View style={styles.timeContainer}>
          <Calendar size={14} color="#64748B" />
          <Text style={styles.notificationTime}>{formatTime(item.timestamp)}</Text>
        </View>
        {item.read ? (
          <CheckCircle size={16} color="#10B981" />
        ) : (
          <Circle size={16} color="#64748B" />
        )}
      </View>
    </TouchableOpacity>
  );

  return (
    <LinearGradient
      colors={['#1E1B4B', '#312E81', '#4C1D95']}
      style={styles.container}
    >
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <ArrowLeft size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>Bildirimler</Text>
          <Text style={styles.headerSubtitle}>
            {notifications.filter(n => !n.read).length} okunmamış bildirim
          </Text>
        </View>
        <TouchableOpacity 
          style={styles.headerAction}
          onPress={markAllAsRead}
        >
          <CheckCircle size={20} color="#8B5CF6" />
        </TouchableOpacity>
      </View>

      {/* Filter Buttons */}
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        style={styles.filterContainer}
        contentContainerStyle={styles.filterContent}
      >
        {[
          { key: 'all', label: 'Tümü' },
          { key: 'unread', label: 'Okunmamış' },
          { key: 'horoscope', label: 'Günlük Yorum' },
          { key: 'ai_chat', label: 'AI Sohbet' },
          { key: 'birth_chart', label: 'Doğum Haritası' },
          { key: 'system', label: 'Sistem' }
        ].map((filter) => (
          <TouchableOpacity
            key={filter.key}
            style={[
              styles.filterButton,
              selectedFilter === filter.key && styles.activeFilterButton
            ]}
            onPress={() => setSelectedFilter(filter.key)}
          >
            <Text style={[
              styles.filterButtonText,
              selectedFilter === filter.key && styles.activeFilterButtonText
            ]}>
              {filter.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Notifications List */}
      {filteredNotifications.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Bell size={64} color="#64748B" />
          <Text style={styles.emptyTitle}>
            {selectedFilter === 'all' ? 'Henüz bildirim yok' : 'Bu kategoride bildirim yok'}
          </Text>
          <Text style={styles.emptySubtitle}>
            Yeni bildirimler burada görünecek
          </Text>
        </View>
      ) : (
        <FlatList
          data={filteredNotifications}
          renderItem={renderNotificationItem}
          keyExtractor={(item) => item.id}
          style={styles.notificationsList}
          contentContainerStyle={styles.notificationsContent}
          showsVerticalScrollIndicator={false}
        />
      )}

      {/* Clear All Button */}
      {notifications.length > 0 && (
        <View style={styles.bottomActions}>
          <TouchableOpacity
            style={styles.clearAllButton}
            onPress={clearAllNotifications}
          >
            <Trash2 size={20} color="#EF4444" />
            <Text style={styles.clearAllButtonText}>Tüm Bildirimleri Temizle</Text>
          </TouchableOpacity>
        </View>
      )}
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  backButton: {
    padding: 8,
  },
  headerCenter: {
    flex: 1,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF',
  },
  headerSubtitle: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#CBD5E1',
    marginTop: 2,
  },
  headerAction: {
    padding: 8,
  },
  filterContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  filterContent: {
    gap: 8,
  },
  filterButton: {
    backgroundColor: 'rgba(30, 41, 59, 0.8)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#334155',
  },
  activeFilterButton: {
    backgroundColor: '#8B5CF6',
    borderColor: '#8B5CF6',
  },
  filterButtonText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#E2E8F0',
  },
  activeFilterButtonText: {
    color: '#FFFFFF',
  },
  notificationsList: {
    flex: 1,
  },
  notificationsContent: {
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
  notificationCard: {
    backgroundColor: 'rgba(30, 41, 59, 0.8)',
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#334155',
    marginBottom: 12,
  },
  unreadCard: {
    borderColor: '#8B5CF6',
    backgroundColor: 'rgba(139, 92, 246, 0.1)',
  },
  notificationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  notificationLeft: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    flex: 1,
  },
  notificationInfo: {
    flex: 1,
  },
  notificationTitle: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: '#E2E8F0',
    marginBottom: 2,
  },
  unreadTitle: {
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF',
  },
  notificationCategory: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#94A3B8',
  },
  notificationRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  priorityDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  deleteButton: {
    padding: 4,
  },
  notificationMessage: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#CBD5E1',
    lineHeight: 20,
    marginBottom: 12,
  },
  notificationFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  notificationTime: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#64748B',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF',
    marginTop: 16,
    marginBottom: 8,
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#94A3B8',
    textAlign: 'center',
    lineHeight: 20,
  },
  bottomActions: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: 'rgba(30, 27, 75, 0.95)',
    borderTopWidth: 1,
    borderTopColor: '#334155',
  },
  clearAllButton: {
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.2)',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  clearAllButtonText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#EF4444',
  },
});