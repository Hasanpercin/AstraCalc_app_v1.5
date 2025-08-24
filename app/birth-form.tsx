import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  TextInput, 
  ScrollView,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { ArrowLeft, Calendar, Clock, MapPin, User } from 'lucide-react-native';
import { useAuth } from '../hooks/useAuth';
import { WebhookService } from '../services/webhook';

interface FormData {
  fullName: string;
  birthDate: string;
  birthTime: string;
  birthPlace: string;
}

export default function BirthFormScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const [isUpdating, setIsUpdating] = useState(false);
  const [existingData, setExistingData] = useState<any>(null);
  const [formData, setFormData] = useState<FormData>({
    fullName: '',
    birthDate: '',
    birthTime: '',
    birthPlace: '',
  });
  
  const [loading, setLoading] = useState(false);

  // Component mount debug
  useEffect(() => {
    console.log('🎯 BirthFormScreen component mounted');
    console.log('👤 Current user:', user?.id || 'No user');
    console.log('🔄 Is updating:', isUpdating);
    return () => {
      console.log('🚫 BirthFormScreen component unmounting');
    };
  }, []);

  // Form data change debug
  useEffect(() => {
    console.log('📝 Form data changed:', formData);
  }, [formData]);

  useEffect(() => {
    checkExistingChart();
  }, [user]);

  const checkExistingChart = async () => {
    console.log('🔍 checkExistingChart called - User ID:', user?.id || 'No user');
    
    if (!user?.id) {
      console.log('👥 No authenticated user - skipping database check, form will be empty for new creation');
      setIsUpdating(false);
      setExistingData(null);
      setFormData({
        fullName: '',
        birthDate: '',
        birthTime: '',
        birthPlace: '',
      });
      return;
    }

    try {
      console.log('🗃️ Authenticated user detected, checking for existing chart data');
      const result = await WebhookService.getBirthChartData(user.id);
      
      if (result.data) {
        console.log('✅ Existing chart found for user - switching to update mode');
        setIsUpdating(true);
        setExistingData(result.data);
        setFormData({
          fullName: result.data.full_name || '',
          birthDate: result.data.birth_date || '',
          birthTime: result.data.birth_time || '',
          birthPlace: result.data.birth_place || '',
        });
      } else {
        console.log('ℹ️ No existing chart found for user - staying in create mode');
        setIsUpdating(false);
        setExistingData(null);
        // Keep form empty for new data entry
      }
    } catch (error) {
      console.error('❌ Error checking existing chart:', error);
      // On error, default to create mode
      setIsUpdating(false);
      setExistingData(null);
    }
  };

  const validateForm = (): boolean => {
    console.log('✅ validateForm called - checking form data:', formData);
    
    if (!formData.fullName.trim()) {
      console.log('❌ Validation failed: fullName is empty');
      Alert.alert('Hata', 'Lütfen isim soyisim alanını doldurun.');
      return false;
    }
    
    if (!formData.birthDate.trim()) {
      console.log('❌ Validation failed: birthDate is empty');
      Alert.alert('Hata', 'Lütfen doğum tarihi alanını doldurun.');
      return false;
    }

    if (!formData.birthTime.trim()) {
      console.log('❌ Validation failed: birthTime is empty');
      Alert.alert('Hata', 'Lütfen doğum saati alanını doldurun.');
      return false;
    }
    
    if (!formData.birthPlace.trim()) {
      console.log('❌ Validation failed: birthPlace is empty');
      Alert.alert('Hata', 'Lütfen doğum yeri alanını doldurun.');
      return false;
    }
    console.log('✅ Validation passed - form is valid');
    return true;
  };

  const handleSubmit = async () => {
    console.log('🔥 handleSubmit called - FORM SUBMISSION STARTED');
    if (!validateForm()) return;

    // Show confirmation dialog for updates
    if (isUpdating) {
      Alert.alert(
        'Doğum Bilgilerini Güncelle',
        'Doğum bilgilerinizi güncellemek doğum haritanızı ve yorumlarınızı yeniden hesaplayacak. Devam etmek istiyor musunuz?',
        [
          { text: 'İptal', style: 'cancel' },
          { text: 'Güncelle', onPress: () => performUpdate() }
        ]
      );
      return;
    }

    console.log('handleSubmit: isUpdating is false, performing update directly.');
    await performUpdate();
  };

  const performUpdate = async () => {
    console.log('🚀 performUpdate called - Starting webhook request...');
    console.log('📋 Form data:', formData);
    console.log('👤 User ID:', user?.id);
    
    setLoading(true);
    
    try {
      const birthData = {
        fullName: formData.fullName,
        birthDate: formData.birthDate,
        birthTime: formData.birthTime,
        birthPlace: formData.birthPlace,
        userId: user?.id || 'demo-user',
      };
      console.log('📦 Prepared birth data for webhook:', birthData);

      const result = await WebhookService.sendBirthData(birthData);
      console.log('📨 Webhook service result:', result);
      
      console.log('📊 Webhook success status:', result.success);
      
      if (result.success) {
        const successMessage = isUpdating ? 
          'Doğum haritanız başarıyla güncellendi!' : 
          'Doğum haritanız başarıyla oluşturuldu!';
        
        console.log('✅ Success:', successMessage);

        Alert.alert(
          'Başarılı', 
          successMessage,
          [
            { 
              text: 'Doğum Haritasını Gör', 
              onPress: () => router.push('/(tabs)/birth-chart') 
            }
          ]
        );
      } else {
        console.log('❌ Webhook failed with error:', result.error);
        throw new Error(result.error || 'Veri gönderimi başarısız');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Bilinmeyen hata oluştu';
      console.error('Form submission error:', errorMessage);
      
      // Show more helpful error messages to users
      let displayMessage = errorMessage;
      if (errorMessage.includes('İnternet bağlantınızı kontrol edin')) {
        displayMessage = 'İnternet bağlantınızı kontrol edin ve tekrar deneyin.';
      } else if (errorMessage.includes('Sunucu bağlantısı kurulamadı')) {
        displayMessage = 'Sunucu ile bağlantı kurulamadı. Lütfen daha sonra tekrar deneyin.';
      } else if (errorMessage.includes('zaman aşımı')) {
        displayMessage = 'İstek zaman aşımına uğradı. İnternet bağlantınızı kontrol edin.';
      }
      
      Alert.alert(
        'Hata', 
        `Doğum haritası ${isUpdating ? 'güncellenemedi' : 'oluşturulamadı'}: ${displayMessage}`
      );
    } finally {
      setLoading(false);
      console.log('✅ performUpdate finished. Loading set to false.');
    }
  };

  return (
    <LinearGradient
      colors={['#1E1B4B', '#312E81', '#4C1D95']}
      style={styles.container}
    >
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <ArrowLeft size={24} color="#FFFFFF" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>
            {isUpdating ? 'Doğum Bilgilerini Güncelle' : 'Doğum Bilgilerinizi Girin'}
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
                value={formData.fullName}
                onChangeText={(text) => setFormData(prev => ({ ...prev, fullName: text }))}
                placeholder="Adınızı ve soyadınızı girin"
                placeholderTextColor="#64748B"
              />
            </View>
          </View>

          {/* Birth Date Input */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Doğum Tarihi * (GG/AA/YYYY)</Text>
            <View style={styles.inputContainer}>
              <Calendar size={20} color="#8B5CF6" style={styles.inputIcon} />
              <TextInput
                style={styles.textInput}
                value={formData.birthDate}
                onChangeText={(text) => setFormData(prev => ({ ...prev, birthDate: text }))}
                placeholder="15/01/1990"
                placeholderTextColor="#64748B"
              />
            </View>
          </View>

          {/* Birth Time Input */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Doğum Saati * (SS:DD)</Text>
            <View style={styles.inputContainer}>
              <Clock size={20} color="#8B5CF6" style={styles.inputIcon} />
              <TextInput
                style={styles.textInput}
                value={formData.birthTime}
                onChangeText={(text) => setFormData(prev => ({ ...prev, birthTime: text }))}
                placeholder="14:30"
                placeholderTextColor="#64748B"
              />
            </View>
          </View>

          {/* Birth Place */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Doğum Yeri *</Text>
            <View style={styles.inputContainer}>
              <MapPin size={20} color="#8B5CF6" style={styles.inputIcon} />
              <TextInput
                style={styles.textInput}
                value={formData.birthPlace}
                onChangeText={(text) => setFormData(prev => ({ ...prev, birthPlace: text }))}
                placeholder="Şehir, Ülke (örn: İstanbul, Türkiye)"
                placeholderTextColor="#64748B"
              />
            </View>
          </View>

          {/* Info Text */}
          <View style={styles.infoContainer}>
            <Text style={styles.infoText}>
              {isUpdating ? 
                '* Doğum bilgilerinizi güncellemek haritanızı yeniden hesaplayacaktır.' :
                '* Doğru doğum haritası için tüm bilgilerin eksiksiz olması önemlidir.'
              }
            </Text>
          </View>

          {/* Submit Button */}
          <TouchableOpacity
            style={[styles.submitButton, loading && styles.submitButtonDisabled]}
            onPress={handleSubmit}
            disabled={loading}
          >
            <Text style={styles.submitButtonText}>
              {loading ? 
                (isUpdating ? 'Güncelleniyor...' : 'Gönderiliyor...') : 
                (isUpdating ? 'Doğum Haritası Güncelle' : 'Doğum Haritası Oluştur')
              }
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 30,
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
  infoContainer: {
    backgroundColor: 'rgba(59, 130, 246, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(59, 130, 246, 0.2)',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
  },
  infoText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#93C5FD',
    lineHeight: 20,
  },
  submitButton: {
    backgroundColor: '#8B5CF6',
    paddingVertical: 18,
    borderRadius: 12,
    marginTop: 8,
    shadowColor: '#8B5CF6',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 8,
  },
  submitButtonDisabled: {
    backgroundColor: '#64748B',
    shadowOpacity: 0,
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    textAlign: 'center',
  },
});