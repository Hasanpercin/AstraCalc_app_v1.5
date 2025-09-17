import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { User, Mail, Phone, Calendar, Clock, MapPin } from 'lucide-react-native';

interface UserData {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  birth_date: string;
  birth_time: string;
  birth_place: string;
}

interface ValidationErrors {
  [key: string]: string;
}

interface UserRegistrationFormProps {
  onSubmit: (userData: UserData) => void;
  loading?: boolean;
}

export function UserRegistrationForm({ onSubmit, loading = false }: UserRegistrationFormProps) {
  const [userData, setUserData] = useState<UserData>({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    birth_date: '',
    birth_time: '',
    birth_place: '',
  });

  const [validationErrors, setValidationErrors] = useState<ValidationErrors>({});

  const handleInputChange = (field: keyof UserData, value: string) => {
    setUserData(prev => ({ ...prev, [field]: value }));
    
    // Clear validation error when user starts typing
    if (validationErrors[field]) {
      setValidationErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const validateForm = (): boolean => {
    const errors: ValidationErrors = {};

    if (!userData.first_name.trim()) {
      errors.first_name = 'İsim gerekli';
    }

    if (!userData.last_name.trim()) {
      errors.last_name = 'Soyisim gerekli';
    }

    if (!userData.email.trim()) {
      errors.email = 'E-posta gerekli';
    } else if (!/\S+@\S+\.\S+/.test(userData.email)) {
      errors.email = 'Geçerli bir e-posta adresi girin';
    }

    if (!userData.phone.trim()) {
      errors.phone = 'Telefon numarası gerekli';
    }

    if (!userData.birth_date.trim()) {
      errors.birth_date = 'Doğum tarihi gerekli';
    }

    if (!userData.birth_time.trim()) {
      errors.birth_time = 'Doğum saati gerekli';
    }

    if (!userData.birth_place.trim()) {
      errors.birth_place = 'Doğum yeri gerekli';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      onSubmit(userData);
    } else {
      Alert.alert('Hata', 'Lütfen tüm gerekli alanları doldurun');
    }
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.form}>
          <Text style={styles.title}>Kullanıcı Kayıt Formu</Text>
          <Text style={styles.subtitle}>Astroloji yorumunuz için gerekli bilgileri girin</Text>

          {/* Personal Information */}
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Kişisel Bilgiler</Text>
          </View>

          {/* First Name */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>İsim</Text>
            <View style={[styles.inputContainer, validationErrors.first_name && styles.inputError]}>
              <User size={20} />
              <TextInput
                style={styles.textInput}
                placeholder="İsminizi girin"
                value={userData.first_name}
                onChangeText={(value: string) => handleInputChange('first_name', value)}
                placeholderTextColor="#64748B"
                autoCapitalize="words"
              />
            </View>
            {validationErrors.first_name && (
              <Text style={styles.errorText}>{validationErrors.first_name}</Text>
            )}
          </View>

          {/* Last Name */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Soyisim</Text>
            <View style={[styles.inputContainer, validationErrors.last_name && styles.inputError]}>
              <User size={20} />
              <TextInput
                style={styles.textInput}
                placeholder="Soyisminizi girin"
                value={userData.last_name}
                onChangeText={(value: string) => handleInputChange('last_name', value)}
                placeholderTextColor="#64748B"
                autoCapitalize="words"
              />
            </View>
            {validationErrors.last_name && (
              <Text style={styles.errorText}>{validationErrors.last_name}</Text>
            )}
          </View>

          {/* Email */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>E-posta</Text>
            <View style={[styles.inputContainer, validationErrors.email && styles.inputError]}>
              <Mail size={20} />
              <TextInput
                style={styles.textInput}
                placeholder="E-posta adresinizi girin"
                value={userData.email}
                onChangeText={(value: string) => handleInputChange('email', value)}
                placeholderTextColor="#64748B"
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>
            {validationErrors.email && (
              <Text style={styles.errorText}>{validationErrors.email}</Text>
            )}
          </View>

          {/* Phone */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Telefon</Text>
            <View style={[styles.inputContainer, validationErrors.phone && styles.inputError]}>
              <Phone size={20} />
              <TextInput
                style={styles.textInput}
                placeholder="Telefon numaranızı girin"
                value={userData.phone}
                onChangeText={(value: string) => handleInputChange('phone', value)}
                placeholderTextColor="#64748B"
                keyboardType="phone-pad"
              />
            </View>
            {validationErrors.phone && (
              <Text style={styles.errorText}>{validationErrors.phone}</Text>
            )}
          </View>

          {/* Birth Information */}
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Doğum Bilgileri</Text>
            <Text style={styles.sectionSubtitle}>
              Astroloji yorumu için doğum bilgileriniz gereklidir
            </Text>
          </View>

          {/* Birth Date */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Doğum Tarihi</Text>
            <View style={styles.inputContainer}>
              <Calendar size={20} />
              <TextInput
                style={styles.textInput}
                placeholder="DD/MM/YYYY"
                value={userData.birth_date}
                onChangeText={(value: string) => handleInputChange('birth_date', value)}
                placeholderTextColor="#64748B"
              />
            </View>
            {validationErrors.birth_date && (
              <Text style={styles.errorText}>{validationErrors.birth_date}</Text>
            )}
          </View>

          {/* Birth Time */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Doğum Saati</Text>
            <View style={styles.inputContainer}>
              <Clock size={20} />
              <TextInput
                style={styles.textInput}
                placeholder="HH:MM"
                value={userData.birth_time}
                onChangeText={(value: string) => handleInputChange('birth_time', value)}
                placeholderTextColor="#64748B"
              />
            </View>
            {validationErrors.birth_time && (
              <Text style={styles.errorText}>{validationErrors.birth_time}</Text>
            )}
          </View>

          {/* Birth Place */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Doğum Yeri</Text>
            <View style={styles.inputContainer}>
              <MapPin size={20} />
              <TextInput
                style={styles.textInput}
                placeholder="Şehir, Ülke"
                value={userData.birth_place}
                onChangeText={(value: string) => handleInputChange('birth_place', value)}
                placeholderTextColor="#64748B"
              />
            </View>
            {validationErrors.birth_place && (
              <Text style={styles.errorText}>{validationErrors.birth_place}</Text>
            )}
          </View>

          {/* Info Box */}
          <View style={styles.infoContainer}>
            <Text style={styles.infoText}>
              🌟 Doğum bilgileriniz sadece astroloji yorumu için kullanılır ve güvenle saklanır.
            </Text>
          </View>

          {/* Submit Button */}
          <TouchableOpacity
            style={[styles.submitButton, loading && styles.submitButtonDisabled]}
            onPress={handleSubmit}
            disabled={loading}
          >
            <Text style={styles.submitButtonText}>
              {loading ? 'Kaydediliyor...' : 'Kayıt Ol'}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  scrollView: {
    flex: 1,
  },
  form: {
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1E293B',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#64748B',
    textAlign: 'center',
    marginBottom: 32,
  },
  sectionHeader: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 4,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: '#6B7280',
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 8,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  inputError: {
    borderColor: '#EF4444',
  },
  inputIcon: {
    marginRight: 12,
    color: '#8B5CF6',
  },
  textInput: {
    flex: 1,
    fontSize: 16,
    color: '#1E293B',
  },
  errorText: {
    fontSize: 14,
    color: '#EF4444',
    marginTop: 4,
  },
  infoContainer: {
    backgroundColor: '#F0F9FF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    borderLeftWidth: 4,
    borderLeftColor: '#0EA5E9',
  },
  infoText: {
    fontSize: 14,
    color: '#0C4A6E',
    lineHeight: 20,
  },
  submitButton: {
    backgroundColor: '#8B5CF6',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 8,
  },
  submitButtonDisabled: {
    backgroundColor: '#A1A1AA',
  },
  submitButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});
