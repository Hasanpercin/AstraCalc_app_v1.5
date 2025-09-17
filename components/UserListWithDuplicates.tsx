import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { Users, AlertCircle, Trash2 } from 'lucide-react-native';

interface UserDisplayInfo {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  birth_date?: string;
  birth_place?: string;
  duplicateCount: number;
  created_at: string;
}

interface UserListWithDuplicatesProps {
  users: UserDisplayInfo[];
  onDeleteUser?: (userId: string) => void;
  loading?: boolean;
}

export function UserListWithDuplicates({ 
  users, 
  onDeleteUser, 
  loading = false 
}: UserListWithDuplicatesProps) {
  const [duplicateUsers, setDuplicateUsers] = useState<UserDisplayInfo[]>([]);

  useEffect(() => {
    // Filter users with duplicates (duplicateCount > 1)
    const usersWithDuplicates = users.filter(user => user.duplicateCount > 1);
    setDuplicateUsers(usersWithDuplicates);
  }, [users]);

  const handleDeleteUser = (userId: string, userName: string) => {
    Alert.alert(
      'Kullanıcıyı Sil',
      `${userName} adlı kullanıcıyı silmek istediğinizden emin misiniz?`,
      [
        {
          text: 'İptal',
          style: 'cancel',
        },
        {
          text: 'Sil',
          style: 'destructive',
          onPress: () => onDeleteUser?.(userId),
        },
      ]
    );
  };

  const renderUserItem = ({ item }: { item: UserDisplayInfo }) => (
    <View style={styles.userCard}>
      <View style={styles.userInfo}>
        <View style={styles.userHeader}>
          <Text style={styles.userName}>
            {item.first_name} {item.last_name}
          </Text>
          <View style={styles.duplicateBadge}>
            <AlertCircle size={16} />
            <Text style={styles.duplicateText}>
              {item.duplicateCount} tekrar
            </Text>
          </View>
        </View>
        
        <Text style={styles.userEmail}>{item.email}</Text>
        
        {item.phone && (
          <Text style={styles.userDetail}>📞 {item.phone}</Text>
        )}
        
        {item.birth_date && (
          <Text style={styles.userDetail}>🎂 {item.birth_date}</Text>
        )}
        
        {item.birth_place && (
          <Text style={styles.userDetail}>📍 {item.birth_place}</Text>
        )}
        
        <Text style={styles.createdDate}>
          Kayıt: {new Date(item.created_at).toLocaleDateString('tr-TR')}
        </Text>
      </View>
      
      {onDeleteUser && (
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() => handleDeleteUser(item.id, `${item.first_name} ${item.last_name}`)}
        >
          <Trash2 size={20} color="#DC2626" />
        </TouchableOpacity>
      )}
    </View>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <Users size={48} />
      <Text style={styles.emptyTitle}>Tekrar Eden Kullanıcı Yok</Text>
      <Text style={styles.emptyText}>
        Şu anda aynı bilgilere sahip birden fazla kullanıcı kaydı bulunmuyor.
      </Text>
    </View>
  );

  const renderHeader = () => (
    <View style={styles.header}>
      <Text style={styles.headerTitle}>Tekrar Eden Kullanıcılar</Text>
      <Text style={styles.headerSubtitle}>
        {duplicateUsers.length} kullanıcının tekrar eden kayıtları var
      </Text>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#8B5CF6" />
        <Text style={styles.loadingText}>Kullanıcılar yükleniyor...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {duplicateUsers.length > 0 && renderHeader()}
      
      <FlatList
        data={duplicateUsers}
        renderItem={renderUserItem}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={renderEmptyState}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#64748B',
  },
  header: {
    padding: 20,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1E293B',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#64748B',
  },
  listContainer: {
    padding: 16,
  },
  userCard: {
    backgroundColor: '#FFFBEB',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'flex-start',
    borderWidth: 1,
    borderColor: '#FEF3C7',
  },
  userInfo: {
    flex: 1,
  },
  userHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  userName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1E293B',
    flex: 1,
  },
  duplicateBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF3C7',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  duplicateIcon: {
    color: '#D97706',
    marginRight: 4,
  },
  duplicateText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#D97706',
  },
  userEmail: {
    fontSize: 16,
    color: '#4F46E5',
    marginBottom: 8,
  },
  userDetail: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 4,
  },
  createdDate: {
    fontSize: 12,
    color: '#9CA3AF',
    marginTop: 8,
  },
  deleteButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#FEE2E2',
    marginLeft: 12,
  },
  deleteIcon: {
    color: '#DC2626',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
    paddingVertical: 64,
  },
  emptyIcon: {
    color: '#9CA3AF',
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1E293B',
    marginBottom: 8,
    textAlign: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 24,
  },
});