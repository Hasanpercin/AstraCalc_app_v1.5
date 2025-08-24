import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  TextInput, 
  ScrollView,
  Alert,
  Platform 
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { ArrowLeft, Calendar, Clock, MapPin } from 'lucide-react-native';
import DateTimePicker from '@react-native-community/datetimepicker';

interface FormData {
  fullName: string;
  birthDate: Date;
  birthTime: Date;
  birthPlace: string;
}

export default function RegisterScreen() {
  const router = useRouter();
  const [formData, setFormData] = useState<FormData>({
    fullName: '',
    birthDate: new Date(),
    birthTime: new Date(),
    birthPlace: '',
  });
  
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    // Form validation
    if (!formData.fullName.trim()) {
      Alert.alert('Hata', 'Lütfen isim soyisim alanını doldurun.');
      return;
    }
    
    if (!formData.birthPlace.trim()) {
      Alert.alert('Hata', 'Lütfen doğum yeri alanını doldurun.');
      return;
    }

    setLoading(true);
    
    try {
      // Webhook entegrasyonu - API çağrısı
      const webhookData = {
        fullName: formData.fullName,
        birthDate: formData.birthDate.toISOString(),
        birthTime: formData.birthTime.toTimeString(),
        birthPlace: formData.birthPlace,
        timestamp: new Date().toISOString(),
      };
      
      // Burada gerçek webhook URL'i kullanılacak
      const response = await fetch('YOUR_WEBHOOK_URL', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(webhookData),
      });
      
      if (response.ok) {
        Alert.alert(
          'Başarılı', 
          'Bilgileriniz kaydedildi! Ana sayfaya yönlendiriliyorsunuz.',
          [{ text: 'Tamam', onPress: () => router.replace('/(tabs)') }]
        );
      } else {
        throw new Error('Veri gönderimi başarısız');
      }
    } catch (error) {
      Alert.alert('Hata', 'Bilgiler kaydedilemedi. Lütfen tekrar deneyin.');
    } finally {
      setLoading(false);
    }
  };

  const onDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setFormData(prev => ({ ...prev, birthDate: selectedDate }));
    }
  };

  const onTimeChange = (event: any, selectedTime?: Date) => {
    setShowTimePicker(false);
    if (selectedTime) {
      setFormData(prev => ({ ...prev, birthTime: selectedTime }));
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
          <Text style={styles.headerTitle}>Doğum Bilgilerinizi Girin</Text>
        </View>

        <View style={styles.formContainer}>
          {/* Full Name Input */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>İsim Soyisim</Text>
            <TextInput
              style={styles.textInput}
              value={formData.fullName}
              onChangeText={(text) => setFormData(prev => ({ ...prev, fullName: text }))}
              placeholder="Adınızı ve soyadınızı girin"
              placeholderTextColor="#64748B"
            />
          </View>

          {/* Birth Date */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Doğum Tarihi</Text>
            <TouchableOpacity
              style={styles.dateTimeButton}
              onPress={() => setShowDatePicker(true)}
            >
              <Calendar size={20} color="#8B5CF6" />
              <Text style={styles.dateTimeText}>
                {formData.birthDate.toLocaleDateString('tr-TR')}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Birth Time */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Doğum Saati</Text>
            <TouchableOpacity
              style={styles.dateTimeButton}
              onPress={() => setShowTimePicker(true)}
            >
              <Clock size={20} color="#8B5CF6" />
              <Text style={styles.dateTimeText}>
                {formData.birthTime.toLocaleTimeString('tr-TR', { 
                  hour: '2-digit', 
                  minute: '2-digit' 
                })}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Birth Place */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Doğum Yeri</Text>
            <View style={styles.locationInputContainer}>
              <MapPin size={20} color="#8B5CF6" style={styles.locationIcon} />
              <TextInput
                style={styles.locationInput}
                value={formData.birthPlace}
                onChangeText={(text) => setFormData(prev => ({ ...prev, birthPlace: text }))}
                placeholder="Şehir, Ülke"
                placeholderTextColor="#64748B"
              />
            </View>
          </View>

          {/* Submit Button */}
          <TouchableOpacity
            style={[styles.submitButton, loading && styles.submitButtonDisabled]}
            onPress={handleSubmit}
            disabled={loading}
          >
            <Text style={styles.submitButtonText}>
              {loading ? 'Gönderiliyor...' : 'Gönder'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Date Picker */}
        {showDatePicker && (
          <DateTimePicker
            testID="datePicker"
            value={formData.birthDate}
            mode="date"
            is24Hour={true}
            display="default"
            onChange={onDateChange}
          />
        )}

        {/* Time Picker */}
        {showTimePicker && (
          <DateTimePicker
            testID="timePicker"
            value={formData.birthTime}
            mode="time"
            is24Hour={true}
            display="default"
            onChange={onTimeChange}
          />
        )}
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
  textInput: {
    backgroundColor: '#1E293B',
    borderWidth: 1,
    borderColor: '#334155',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 16,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#FFFFFF',
  },
  dateTimeButton: {
    backgroundColor: '#1E293B',
    borderWidth: 1,
    borderColor: '#334155',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  dateTimeText: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#FFFFFF',
  },
  locationInputContainer: {
    backgroundColor: '#1E293B',
    borderWidth: 1,
    borderColor: '#334155',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationIcon: {
    marginRight: 12,
  },
  locationInput: {
    flex: 1,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#FFFFFF',
  },
  submitButton: {
    backgroundColor: '#8B5CF6',
    paddingVertical: 18,
    borderRadius: 12,
    marginTop: 32,
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