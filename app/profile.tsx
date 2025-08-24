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
import { ArrowLeft, User, Mail, Calendar, MapPin, Save } from 'lucide-react-native';
import { useAuth } from '../hooks/useAuth';
import { supabase } from '../lib/supabase';

interface ProfileData {
  full_name: string;
  email: string;
  avatar_url?: string;
}

export default function ProfileScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [profileData, setProfileData] = useState<ProfileData>({
    full_name: '',
    email: '',
    avatar_url: '',
  });

  useEffect(() => {
    if (user) {
      loadUserProfile();
    }
  }, [user]);

  const loadUserProfile = async () => {
    if (!user || !supabase) return;

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('full_name, email, avatar_url')
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
          avatar_url: data.avatar_url || '',
        });
      } else {
        // No profile found, use auth data
        setProfileData({
          full_name: user.user_metadata?.full_name || '',
          email: user.email || '',
          avatar_url: '',
        });
      }
    } catch (error) {
      console.error('Error loading profile:', error);
    } finally {
      setLoading(false);
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
      const { error } = await supabase
        .from('user_profiles')
        .upsert({
          user_id: user.id,
          full_name: profileData.full_name.trim(),
          email: profileData.email.trim().toLowerCase(),
          avatar_url: profileData.avatar_url,
        });

      if (error) {
        throw error;
      }

      Alert.alert(
        'Başarılı',
        'Profil bilgileriniz güncellendi.',
        [{ text: 'Tamam', onPress: () => router.back() }]
      );
    } catch (error) {
      console.error('Save profile error:', error);
      Alert.alert('Hata', 'Profil güncellenemedi. Lütfen tekrar deneyin.');
    } finally {
      setSaving(false);
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
          </View>

          <View style={styles.profileHeader}>
            <View style={styles.avatarContainer}>
              <User size={48} color="#8B5CF6" />
            </View>
            <Text style={styles.profileTitle}>Kişisel Bilgileriniz</Text>
            <Text style={styles.profileSubtitle}>
              Profil bilgilerinizi güncelleyebilirsiniz
            </Text>
          </View>

          <View style={styles.formContainer}>
            {/* Full Name Input */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>İsim Soyisim *</Text>
              <View style={styles.inputContainer}>
                <User size={20} color="#8B5CF6" style={styles.inputIcon} />
                <TextInput
                  style={styles.textInput}
                  value={profileData.full_name}
                  onChangeText={(text) => setProfileData(prev => ({ ...prev, full_name: text }))}
                  placeholder="Adınızı ve soyadınızı girin"
                  placeholderTextColor="#64748B"
                  autoCapitalize="words"
                />
              </View>
            </View>

            {/* Email Input */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>E-posta Adresi *</Text>
              <View style={styles.inputContainer}>
                <Mail size={20} color="#8B5CF6" style={styles.inputIcon} />
                <TextInput
                  style={styles.textInput}
                  value={profileData.email}
                  onChangeText={(text) => setProfileData(prev => ({ ...prev, email: text }))}
                  placeholder="E-posta adresiniz"
                  placeholderTextColor="#64748B"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                />
              </View>
            </View>

            {/* Account Information */}
            <View style={styles.infoSection}>
              <Text style={styles.infoTitle}>Hesap Bilgileri</Text>
              
              <View style={styles.infoCard}>
                <Calendar size={20} color="#10B981" />
                <View style={styles.infoContent}>
                  <Text style={styles.infoLabel}>Kayıt Tarihi</Text>
                  <Text style={styles.infoValue}>
                    {user?.created_at 
                      ? new Date(user.created_at).toLocaleDateString('tr-TR')
                      : 'Bilinmiyor'
                    }
                  </Text>
                </View>
              </View>

              <View style={styles.infoCard}>
                <User size={20} color="#3B82F6" />
                <View style={styles.infoContent}>
                  <Text style={styles.infoLabel}>Kullanıcı ID</Text>
                  <Text style={styles.infoValue}>
                    {user?.id?.slice(0, 8) + '...' || 'Bilinmiyor'}
                  </Text>
                </View>
              </View>
            </View>

            {/* Quick Actions */}
            <View style={styles.quickActions}>
              <TouchableOpacity 
                style={styles.actionButton}
                onPress={() => router.push('/birth-form')}
              >
                <MapPin size={20} color="#F59E0B" />
                <Text style={styles.actionButtonText}>Doğum Bilgileri</Text>
              </TouchableOpacity>
            </View>

            {/* Save Button */}
            <TouchableOpacity
              style={[styles.saveButton, saving && styles.saveButtonDisabled]}
              onPress={saveProfile}
              disabled={saving}
            >
              <Save size={20} color="#FFFFFF" />
              <Text style={styles.saveButtonText}>
                {saving ? 'Kaydediliyor...' : 'Değişiklikleri Kaydet'}
              </Text>
            </TouchableOpacity>
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
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  backButton: {
    padding: 8,
    marginRight: 16,
  },
  headerTitle: {
    fontSize: 20,
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF',
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
    lineHeight: 20,
  },
  formContainer: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  inputGroup: {
    marginBottom: 24,
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
  inputIcon: {
    marginRight: 12,
  },
  textInput: {
    flex: 1,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#FFFFFF',
  },
  infoSection: {
    marginBottom: 32,
  },
  infoTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF',
    marginBottom: 16,
  },
  infoCard: {
    backgroundColor: 'rgba(30, 41, 59, 0.8)',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#334155',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 12,
  },
  infoContent: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#94A3B8',
    marginBottom: 2,
  },
  infoValue: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#E2E8F0',
  },
  quickActions: {
    marginBottom: 32,
  },
  actionButton: {
    backgroundColor: 'rgba(245, 158, 11, 0.2)',
    borderWidth: 1,
    borderColor: 'rgba(245, 158, 11, 0.3)',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  actionButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
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
});