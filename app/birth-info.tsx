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
import { ArrowLeft, User, Calendar, Clock, MapPin, Save, CreditCard as Edit3 } from 'lucide-react-native';
import { useAuth } from '../hooks/useAuth';
import { supabase } from '../lib/supabase';

interface BirthData {
  full_name: string;
  birth_date: string;
  birth_time: string;
  birth_place: string;
}

export default function BirthInfoScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState(false);
  const [birthData, setBirthData] = useState<BirthData>({
    full_name: '',
    birth_date: '',
    birth_time: '',
    birth_place: '',
  });
  const [hasBirthData, setHasBirthData] = useState(false);

  useEffect(() => {
    if (user) {
      loadBirthData();
    }
  }, [user]);

  const loadBirthData = async () => {
    setLoading(true);
    try {
      if (!user || !supabase) {
        console.log('🔍 loadBirthData: No user or supabase configured');
        setLoading(false);
        return;
      }

      console.log('🔍 loadBirthData: Checking birth_chart_data table for user:', user.id);
      
      // First, try to get data from birth_chart_data table
      const { data: birthChartData, error: birthChartError } = await supabase
        .from('birth_chart_data')
        .select('full_name, birth_date, birth_time, birth_place')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(1);

      console.log('🔍 birth_chart_data query result:', { data: birthChartData, error: birthChartError });
      
      if (birthChartData && birthChartData.length > 0 && !birthChartError) {
        console.log('✅ Found birth data in birth_chart_data table');
        const birthRecord = birthChartData[0];
        setBirthData({
          full_name: birthRecord.full_name || '',
          birth_date: birthRecord.birth_date || '',
          birth_time: birthRecord.birth_time || '',
          birth_place: birthRecord.birth_place || '',
        });
        setHasBirthData(true);
        return;
      }
      
      // If no data in birth_chart_data, try astrology_interpretations table
      console.log('🔍 No data in birth_chart_data, checking astrology_interpretations table');
      
      const { data: astrologyData, error: astrologyError } = await supabase
        .from('astrology_interpretations')
        .select('full_name, dogum_tarihi, dogum_saati, dogum_yeri')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(1);
      
      console.log('🔍 astrology_interpretations query result:', { data: astrologyData, error: astrologyError });
      
      if (astrologyData && astrologyData.length > 0 && !astrologyError) {
        console.log('✅ Found birth data in astrology_interpretations table');
        const astrologyRecord = astrologyData[0];
        setBirthData({
          full_name: astrologyRecord.full_name || '',
          birth_date: astrologyRecord.dogum_tarihi || '',
          birth_time: astrologyRecord.dogum_saati || '',
          birth_place: astrologyRecord.dogum_yeri || '',
        });
        setHasBirthData(true);
        return;
      }
      
      // If no data found in either table
      console.log('ℹ️ No birth data found in any table for user:', user.id);
      if (birthChartError && birthChartError.code !== 'PGRST116') {
        console.error('❌ birth_chart_data error:', birthChartError);
      }
      if (astrologyError && astrologyError.code !== 'PGRST116') {
        console.error('❌ astrology_interpretations error:', astrologyError);
      }
        setHasBirthData(false);
    } catch (error) {
      console.error('❌ Critical error loading birth data:', error);
      setHasBirthData(false);
    } finally {
      setLoading(false);
    }
  };

  const validateForm = () => {
    if (!birthData.full_name.trim()) {
      Alert.alert('Hata', 'İsim soyisim gereklidir.');
      return false;
    }

    if (!birthData.birth_date.trim()) {
      Alert.alert('Hata', 'Doğum tarihi gereklidir.');
      return false;
    }

    if (!birthData.birth_time.trim()) {
      Alert.alert('Hata', 'Doğum saati gereklidir.');
      return false;
    }

    if (!birthData.birth_place.trim()) {
      Alert.alert('Hata', 'Doğum yeri gereklidir.');
      return false;
    }

    return true;
  };

  const saveBirthData = async () => {
    if (!validateForm() || !user || !supabase) return;

    setSaving(true);
    try {
      // Ensure birth_date is in DD-MM-YYYY format
      let formattedBirthDate = birthData.birth_date.trim();
      
      // Convert YYYY-MM-DD to DD-MM-YYYY if needed
      if (formattedBirthDate.match(/^\d{4}-\d{2}-\d{2}$/)) {
        const parts = formattedBirthDate.split('-');
        formattedBirthDate = `${parts[2]}-${parts[1]}-${parts[0]}`;
      }

      console.log('💾 Saving birth data to birth_chart_data table:', {
        user_id: user.id,
        full_name: birthData.full_name.trim(),
        birth_date: formattedBirthDate,
        birth_time: birthData.birth_time.trim(),
        birth_place: birthData.birth_place.trim(),
      });
      
      const { error } = await supabase
        .from('birth_chart_data')
        .upsert({
          user_id: user.id,
          full_name: birthData.full_name.trim(),
          birth_date: formattedBirthDate,
          birth_time: birthData.birth_time.trim(),
          birth_place: birthData.birth_place.trim(),
        });

      if (error) {
        console.error('❌ Error saving birth data:', error);
        throw error;
      }

      console.log('✅ Birth data saved successfully');
      Alert.alert('Başarılı', 'Doğum bilgileriniz güncellendi.');
      setEditing(false);
      setHasBirthData(true);
    } catch (error) {
      console.error('Save birth data error:', error);
      Alert.alert('Hata', 'Doğum bilgileri güncellenemedi. Lütfen tekrar deneyin.');
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
            <Text style={styles.headerTitle}>Doğum Bilgileri</Text>
            {hasBirthData && (
              <TouchableOpacity 
                style={styles.editButton}
                onPress={() => setEditing(!editing)}
              >
                <Edit3 size={20} color={editing ? "#F59E0B" : "#8B5CF6"} />
              </TouchableOpacity>
            )}
          </View>

          <View style={styles.formContainer}>
            {!hasBirthData && !editing ? (
              // No Birth Data State
              <View style={styles.noBirthDataContainer}>
                <View style={styles.noBirthDataIcon}>
                  <Calendar size={48} color="#8B5CF6" />
                </View>
                <Text style={styles.noBirthDataTitle}>Doğum Bilgileriniz Kayıtlı Değil</Text>
                <Text style={styles.noBirthDataSubtitle}>
                  Astroloji yorumları için doğum bilgilerinizi kaydetmeniz gerekiyor.
                </Text>
                <TouchableOpacity
                  style={styles.addBirthDataButton}
                  onPress={() => {
                    console.log('Create chart button pressed');
                    Alert.alert(
                      'Doğum Haritasını Güncelle',
                      'Bu bilgilerle doğum haritanızı yeniden hesaplamak istiyor musunuz?',
                      [
                        { text: 'İptal', style: 'cancel' },
                        { 
                          text: 'Güncelle', 
                          onPress: () => {
                            console.log('Navigating to birth form');
                            router.push('/birth-form');
                          }
                        }
                      ]
                    );
                  }}
                >
                  <Text style={styles.addBirthDataButtonText}>Doğum Bilgilerini Ekle</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <>
                {/* Full Name */}
                <View style={styles.inputGroup}>
                  <Text style={styles.label}>İsim Soyisim</Text>
                  <View style={[styles.inputContainer, !editing && styles.inputDisabled]}>
                    <User size={20} color="#8B5CF6" style={styles.inputIcon} />
                    <TextInput
                      style={styles.textInput}
                      value={birthData.full_name}
                      onChangeText={(text) => setBirthData(prev => ({ ...prev, full_name: text }))}
                      placeholder="Adınızı ve soyadınızı girin"
                      placeholderTextColor="#64748B"
                      autoCapitalize="words"
                      editable={editing}
                    />
                  </View>
                </View>

                {/* Birth Date */}
                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Doğum Tarihi</Text>
                  <View style={[styles.inputContainer, !editing && styles.inputDisabled]}>
                    <Calendar size={20} color="#8B5CF6" style={styles.inputIcon} />
                    <TextInput
                      style={styles.textInput}
                      value={birthData.birth_date}
                      onChangeText={(text) => setBirthData(prev => ({ ...prev, birth_date: text }))}
                      placeholder="15/01/1990"
                      placeholderTextColor="#64748B"
                      editable={editing}
                    />
                  </View>
                  {!editing && birthData.birth_date && (
                    <Text style={styles.displayText}>
                      {formatDate(birthData.birth_date)}
                    </Text>
                  )}
                </View>

                {/* Birth Time */}
                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Doğum Saati</Text>
                  <View style={[styles.inputContainer, !editing && styles.inputDisabled]}>
                    <Clock size={20} color="#8B5CF6" style={styles.inputIcon} />
                    <TextInput
                      style={styles.textInput}
                      value={birthData.birth_time}
                      onChangeText={(text) => setBirthData(prev => ({ ...prev, birth_time: text }))}
                      placeholder="14:30"
                      placeholderTextColor="#64748B"
                      editable={editing}
                    />
                  </View>
                </View>

                {/* Birth Place */}
                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Doğum Yeri</Text>
                  <View style={[styles.inputContainer, !editing && styles.inputDisabled]}>
                    <MapPin size={20} color="#8B5CF6" style={styles.inputIcon} />
                    <TextInput
                      style={styles.textInput}
                      value={birthData.birth_place}
                      onChangeText={(text) => setBirthData(prev => ({ ...prev, birth_place: text }))}
                      placeholder="Şehir, Ülke"
                      placeholderTextColor="#64748B"
                      editable={editing}
                    />
                  </View>
                </View>

                {/* Action Buttons */}
                {editing && (
                  <View style={styles.actionButtons}>
                    <TouchableOpacity
                      style={[styles.saveButton, saving && styles.saveButtonDisabled]}
                      onPress={saveBirthData}
                      disabled={saving}
                    >
                      <Save size={20} color="#FFFFFF" />
                      <Text style={styles.saveButtonText}>
                        {saving ? 'Kaydediliyor...' : 'Kaydet'}
                      </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={styles.cancelButton}
                      onPress={() => {
                        setEditing(false);
                        loadBirthData(); // Reload original data
                      }}
                    >
                      <Text style={styles.cancelButtonText}>İptal</Text>
                    </TouchableOpacity>
                  </View>
                )}

                {/* Create Birth Chart Button */}
                {hasBirthData && !editing && (
                  <TouchableOpacity
                    style={styles.createChartButton}
                    onPress={() => {
                      Alert.alert(
                        'Doğum Haritasını Güncelle',
                        'Bu bilgilerle doğum haritanızı yeniden hesaplamak istiyor musunuz?',
                        [
                          { text: 'İptal', style: 'cancel' },
                          { text: 'Güncelle', onPress: () => router.push('/birth-form') }
                        ]
                      );
                    }}
                  >
                    <Text style={styles.createChartButtonText}>
                      Doğum Haritasını Yeniden Hesapla
                    </Text>
                  </TouchableOpacity>
                )}
              </>
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
    paddingBottom: 30,
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
  formContainer: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  noBirthDataContainer: {
    alignItems: 'center',
    paddingVertical: 60,
  },
  noBirthDataIcon: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(139, 92, 246, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
    borderWidth: 2,
    borderColor: '#8B5CF6',
  },
  noBirthDataTitle: {
    fontSize: 22,
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 12,
  },
  noBirthDataSubtitle: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#CBD5E1',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 32,
  },
  addBirthDataButton: {
    backgroundColor: '#8B5CF6',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 12,
    shadowColor: '#8B5CF6',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 8,
  },
  addBirthDataButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
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
  displayText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#94A3B8',
    marginTop: 4,
    marginLeft: 4,
  },
  actionButtons: {
    gap: 12,
    marginTop: 16,
  },
  saveButton: {
    backgroundColor: '#8B5CF6',
    paddingVertical: 16,
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
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
  },
  cancelButton: {
    backgroundColor: 'transparent',
    paddingVertical: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#64748B',
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#94A3B8',
    fontSize: 16,
    fontFamily: 'Inter-Medium',
  },
  createChartButton: {
    backgroundColor: 'rgba(245, 158, 11, 0.2)',
    borderWidth: 1,
    borderColor: 'rgba(245, 158, 11, 0.3)',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 24,
  },
  createChartButtonText: {
    color: '#F59E0B',
    fontSize: 16,
    fontFamily: 'Inter-Medium',
  },
});