import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { ArrowLeft, User, Calendar } from 'lucide-react-native';
import { useAuth } from '../hooks/useAuth';
import { supabase } from '../lib/supabase';

interface ProfileData {
  full_name: string;
  email: string;
  phone: string;
  avatar_url?: string;
}

interface BirthData {
  full_name: string;
  birth_date: string;
  birth_time: string;
  birth_place: string;
}

export default function ProfileInfoScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState(false);
  const [profileData, setProfileData] = useState<ProfileData>({
    full_name: '',
    email: '',
    phone: '',
    avatar_url: '',
  });
  const [birthData, setBirthData] = useState<BirthData | null>(null);

  useEffect(() => {
    if (user) {
      loadUserProfile();
      loadBirthData();
    }
  }, [user]);

  const loadUserProfile = async () => {
    if (!user || !supabase) return;

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('full_name, email, phone, avatar_url')
        .eq('user_id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error loading profile:', error);
        return;
      }

      if (data) {
        setProfileData({
          full_name: data.full_name || '',
          email: data.email || user.email || '',
          phone: data.phone || '',
          avatar_url: data.avatar_url || '',
        });
      } else {
        // No profile found, use auth data
        setProfileData({
          full_name: user.user_metadata?.full_name || '',
          email: user.email || '',
          phone: user.user_metadata?.phone || '',
          avatar_url: '',
        });
      }
    } catch (error) {
      console.error('Error loading profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadBirthData = async () => {
    if (!user || !supabase) return;

    try {
      const { data, error } = await supabase
        .from('birth_chart_data')
        .select('full_name, birth_date, birth_time, birth_place')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(1);

      if (data && data.length > 0 && !error) {
        const birthRecord = data[0];
        setBirthData({
          full_name: birthRecord.full_name,
          birth_date: birthRecord.birth_date,
          birth_time: birthRecord.birth_time,
          birth_place: birthRecord.birth_place,
        });
      } else if (error) {
        console.error('Error loading birth data:', error);
      }
    } catch (error) {
      console.error('Error loading birth data:', error);
    }
  };

  const validateForm = () => {
    if (!profileData.full_name.trim()) {
      Alert.alert('Hata', 'İsim ve soyisim boş olamaz.');
      return false;
    }

    if (!profileData.email.trim()) {
      Alert.alert('Hata', 'E-posta adresi boş olamaz.');
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(profileData.email)) {
      Alert.alert('Hata', 'Geçerli bir e-posta adresi girin.');
      return false;
    }

    return true;
  };

  const saveProfile = async () => {
    if (!validateForm() || !user || !supabase) return;

    setSaving(true);
    try {
      // Split full name into first and last name
      const nameParts = profileData.full_name.trim().split(' ');
      const firstName = nameParts[0] || '';
      const lastName = nameParts.slice(1).join(' ') || '';

      const { error } = await supabase.rpc('upsert_user_profile', {
        p_user_id: user.id,
        p_first_name: firstName,
        p_last_name: lastName,
        p_email: profileData.email.trim().toLowerCase(),
        p_phone: profileData.phone.trim() || null,
        p_avatar_url: profileData.avatar_url || null,
      });

      if (error) {
        throw error;
      }

      Alert.alert('Başarılı', 'Profil bilgileriniz güncellendi.');
      setEditing(false);
    } catch (error) {
      console.error('Save profile error:', error);
      Alert.alert('Hata', 'Profil güncellenemedi. Lütfen tekrar deneyin.');
    } finally {
      setSaving(false);
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    
    // If already in DD-MM-YYYY format, return as is
    if (dateString.match(/^\d{2}-\d{2}-\d{4}$/)) {
      return dateString;
    }
    
    try {
      // Try to parse different date formats
      let date;
      
      if (dateString.includes('-')) {
        // Handle DD-MM-YYYY or YYYY-MM-DD formats
        const parts = dateString.split('-');
        if (parts.length === 3) {
          if (parts[0].length === 4) {
            // YYYY-MM-DD format
            date = new Date(dateString);
          } else {
            // DD-MM-YYYY format - convert to YYYY-MM-DD
            const [day, month, year] = parts;
            date = new Date(`${year}-${month}-${day}`);
          }
        }
      } else {
        // Try parsing as is
        date = new Date(dateString);
      }
      
      if (date && !isNaN(date.getTime())) {
        // Return in DD-MM-YYYY format
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        return `${day}-${month}-${year}`;
      }
      
      return dateString;
    } catch {
      return dateString;
    }
  };

  if (loading) {
    return (
      <LinearGradient
        colors={['#1E1B4B', '#312E81', '#4C1D95']}
        style={styles.container}
      >
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Yükleniyor...</Text>
        </View>
      </LinearGradient>
    );
  }

  return (
    <LinearGradient
      colors={['#1E1B4B', '#312E81', '#4C1D95']}
      style={styles.container}
    >
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          <View style={styles.header}>
            <TouchableOpacity 
              style={styles.backButton}
              onPress={() => router.back()}
            >
              <ArrowLeft size={24} color="#FFFFFF" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Profil Bilgileri</Text>
            <TouchableOpacity 
              style={styles.editButton}
              onPress={() => setEditing(!editing)}
            >
              <Text style={styles.editIcon}>{editing ? '✏️' : '🖉'}</Text>
            </TouchableOpacity>
          </View>

          {/* Profile Header */}
          <View style={styles.profileHeader}>
            <View style={styles.avatarContainer}>
              <User size={48} color="#8B5CF6" />
            </View>
            <Text style={styles.profileTitle}>{profileData.full_name || 'Kullanıcı'}</Text>
            <Text style={styles.profileSubtitle}>
              Üyelik: {user?.created_at 
                ? new Date(user.created_at).toLocaleDateString('tr-TR')
                : 'Bilinmiyor'
              }
            </Text>
          </View>

          <View style={styles.formContainer}>
            {/* Personal Information Section */}
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Kişisel Bilgiler</Text>
            </View>

            {/* Full Name Input */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>İsim Soyisim *</Text>
              <View style={[styles.inputContainer, !editing && styles.inputDisabled]}>
                <User size={20} color="#8B5CF6" style={styles.inputIcon} />
                <TextInput
                  style={styles.textInput}
                  value={profileData.full_name}
                  onChangeText={(text) => setProfileData(prev => ({ ...prev, full_name: text }))}
                  placeholder="Adınızı ve soyadınızı girin"
                  placeholderTextColor="#64748B"
                  autoCapitalize="words"
                  editable={editing}
                />
              </View>
            </View>

            {/* Email Input */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>E-posta Adresi *</Text>
              <View style={[styles.inputContainer, !editing && styles.inputDisabled]}>
                <Text style={styles.inputIconText}>📧</Text>
                <TextInput
                  style={styles.textInput}
                  value={profileData.email}
                  onChangeText={(text) => setProfileData(prev => ({ ...prev, email: text }))}
                  placeholder="E-posta adresiniz"
                  placeholderTextColor="#64748B"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                  editable={editing}
                />
              </View>
            </View>

            {/* Phone Input */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Telefon</Text>
              <View style={[styles.inputContainer, !editing && styles.inputDisabled]}>
                <Text style={styles.inputIconText}>📞</Text>
                <TextInput
                  style={styles.textInput}
                  value={profileData.phone}
                  onChangeText={(text) => setProfileData(prev => ({ ...prev, phone: text }))}
                  placeholder="Telefon numaranız"
                  placeholderTextColor="#64748B"
                  keyboardType="phone-pad"
                  editable={editing}
                />
              </View>
            </View>

            {/* Birth Information Section */}
            {birthData && (
              <>
                <View style={styles.sectionHeader}>
                  <Text style={styles.sectionTitle}>Doğum Bilgileri</Text>
                  <TouchableOpacity 
                    style={styles.editBirthButton}
                    onPress={() => router.push('/birth-form')}
                  >
                    <Text style={styles.birthEditIcon}>✏️</Text>
                  </TouchableOpacity>
                </View>

                <View style={styles.birthInfoCard}>
                  <View style={styles.birthInfoItem}>
                    <Calendar size={20} color="#F59E0B" />
                    <View style={styles.birthInfoContent}>
                      <Text style={styles.birthInfoLabel}>Doğum Tarihi</Text>
                      <Text style={styles.birthInfoValue}>
                        {formatDate(birthData.birth_date)}
                      </Text>
                    </View>
                  </View>

                  <View style={styles.birthInfoItem}>
                    <Calendar size={20} color="#8B5CF6" />
                    <View style={styles.birthInfoContent}>
                      <Text style={styles.birthInfoLabel}>Doğum Saati</Text>
                      <Text style={styles.birthInfoValue}>{birthData.birth_time}</Text>
                    </View>
                  </View>

                  <View style={styles.birthInfoItem}>
                    <Text style={styles.birthInfoIcon}>📍</Text>
                    <View style={styles.birthInfoContent}>
                      <Text style={styles.birthInfoLabel}>Doğum Yeri</Text>
                      <Text style={styles.birthInfoValue}>{birthData.birth_place}</Text>
                    </View>
                  </View>
                </View>
              </>
            )}

            {/* Account Information */}
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Hesap Bilgileri</Text>
            </View>

            <View style={styles.infoCard}>
              <View style={styles.infoItem}>
                <Text style={styles.infoLabel}>Kullanıcı ID</Text>
                <Text style={[styles.infoValue, styles.userIdText]}>
                  {user?.id || 'Bilinmiyor'}
                </Text>
              </View>

              <View style={styles.infoItem}>
                <Text style={styles.infoLabel}>E-posta Doğrulandı</Text>
                <Text style={[
                  styles.infoValue,
                  user?.email_confirmed_at ? styles.verified : styles.unverified
                ]}>
                  {user?.email_confirmed_at ? 'Evet' : 'Hayır'}
                </Text>
              </View>

              <View style={styles.infoItem}>
                <Text style={styles.infoLabel}>Son Giriş</Text>
                <Text style={styles.infoValue}>
                  {user?.last_sign_in_at 
                    ? new Date(user.last_sign_in_at).toLocaleDateString('tr-TR')
                    : 'Bilinmiyor'
                  }
                </Text>
              </View>
            </View>

            {/* Save Button */}
            {editing && (
              <TouchableOpacity
                style={[styles.saveButton, saving && styles.saveButtonDisabled]}
                onPress={saveProfile}
                disabled={saving}
              >
                <Text style={styles.saveIcon}>✔️</Text>
                <Text style={styles.saveButtonText}>
                  {saving ? 'Kaydediliyor...' : 'Değişiklikleri Kaydet'}
                </Text>
              </TouchableOpacity>
            )}

            {/* Add Birth Data Button */}
            {!birthData && (
              <TouchableOpacity
                style={styles.addBirthButton}
                onPress={() => router.push('/birth-form')}
              >
                <Text style={styles.addBirthIcon}>📍</Text>
                <Text style={styles.addBirthButtonText}>Doğum Bilgilerini Ekle</Text>
              </TouchableOpacity>
            )}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#FFFFFF',
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
  headerTitle: {
    fontSize: 20,
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF',
    flex: 1,
    textAlign: 'center',
    marginHorizontal: 16,
  },
  editButton: {
    padding: 8,
  },
  profileHeader: {
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 32,
  },
  avatarContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(139, 92, 246, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: '#8B5CF6',
    marginBottom: 16,
  },
  profileTitle: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
    marginBottom: 8,
    textAlign: 'center',
  },
  profileSubtitle: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#CBD5E1',
    textAlign: 'center',
  },
  formContainer: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
    marginTop: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF',
  },
  editBirthButton: {
    padding: 4,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: '#E2E8F0',
    marginBottom: 8,
  },
  inputContainer: {
    backgroundColor: '#1E293B',
    borderWidth: 1,
    borderColor: '#334155',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  inputDisabled: {
    backgroundColor: 'rgba(30, 41, 59, 0.5)',
    borderColor: 'rgba(51, 65, 85, 0.5)',
  },
  inputIcon: {
    marginRight: 12,
  },
  textInput: {
    flex: 1,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#FFFFFF',
  },
  birthInfoCard: {
    backgroundColor: 'rgba(30, 41, 59, 0.8)',
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#334155',
    marginBottom: 24,
  },
  birthInfoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 16,
  },
  birthInfoContent: {
    flex: 1,
  },
  birthInfoLabel: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#94A3B8',
    marginBottom: 2,
  },
  birthInfoValue: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#E2E8F0',
  },
  infoCard: {
    backgroundColor: 'rgba(30, 41, 59, 0.8)',
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#334155',
    marginBottom: 32,
  },
  infoItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  infoLabel: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#94A3B8',
  },
  infoValue: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#E2E8F0',
  },
  userIdText: {
    fontSize: 11,
    fontFamily: 'Inter-Mono',
  },
  verified: {
    color: '#10B981',
  },
  unverified: {
    color: '#F59E0B',
  },
  saveButton: {
    backgroundColor: '#8B5CF6',
    paddingVertical: 18,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginBottom: 16,
    shadowColor: '#8B5CF6',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 8,
  },
  saveButtonDisabled: {
    backgroundColor: '#64748B',
    shadowOpacity: 0,
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
  },
  addBirthButton: {
    backgroundColor: 'rgba(245, 158, 11, 0.2)',
    borderWidth: 1,
    borderColor: 'rgba(245, 158, 11, 0.3)',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  addBirthButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: '#F59E0B',
  },
  editIcon: {
    fontSize: 20,
  },
  inputIconText: {
    fontSize: 20,
    marginRight: 12,
  },
  birthEditIcon: {
    fontSize: 16,
  },
  birthInfoIcon: {
    fontSize: 20,
  },
  saveIcon: {
    fontSize: 20,
    marginRight: 8,
  },
  addBirthIcon: {
    fontSize: 20,
    marginRight: 8,
  },
});