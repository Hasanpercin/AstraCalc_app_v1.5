import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { ArrowLeft, Mail, Lock, User, Eye, EyeOff } from 'lucide-react-native';
import { Phone } from 'lucide-react-native';
import { supabase } from '../../lib/supabase';

export default function RegisterScreen() {
  const router = useRouter();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const validateForm = () => {
    if (!fullName.trim()) {
      Alert.alert('Hata', 'Ad ve soyad gereklidir.');
      return false;
    }

    if (fullName.trim().length < 2) {
      Alert.alert('Hata', 'Ad ve soyad en az 2 karakter olmalıdır.');
      return false;
    }

    if (!email.trim()) {
      Alert.alert('Hata', 'E-posta adresi gereklidir.');
      return false;
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Alert.alert('Hata', 'Geçerli bir e-posta adresi girin.');
      return false;
    }

    // Phone validation (optional but if provided, must be valid)
    if (phone.trim() && phone.trim().length < 10) {
      Alert.alert('Hata', 'Telefon numarası en az 10 karakter olmalıdır.');
      return false;
    }

    if (phone.trim() && !/^[\d\s\-\+\(\)]+$/.test(phone.trim())) {
      Alert.alert('Hata', 'Geçerli bir telefon numarası girin.');
      return false;
    }

    if (!password.trim()) {
      Alert.alert('Hata', 'Şifre gereklidir.');
      return false;
    }

    if (password.length < 6) {
      Alert.alert('Hata', 'Şifre en az 6 karakter olmalıdır.');
      return false;
    }

    if (password !== confirmPassword) {
      Alert.alert('Hata', 'Şifreler eşleşmiyor.');
      return false;
    }

    return true;
  };

  const handleRegister = async () => {
    if (!validateForm()) return;

    setLoading(true);
    
    try {
      if (!supabase) {
        // Demo mode - simulate registration
        Alert.alert(
          'Demo Modu',
          'Supabase yapılandırılmamış. Demo modunda kayıt yapılıyor.',
          [{ text: 'Tamam', onPress: () => router.replace('/(tabs)') }]
        );
        return;
      }

      const { error } = await supabase.auth.signUp({
        email: email.trim().toLowerCase(),
        password: password,
        options: {
          data: {
            full_name: fullName.trim(),
            phone: phone.trim() || null,
          },
        },
      });

      if (error) {
        if (error.message.includes('User already registered')) {
          Alert.alert(
            'E-posta Zaten Kayıtlı', 
            'E-posta adresi daha önce kayıt için kullanılmıştır.',
            [
              { text: 'Farklı E-posta Kullan', style: 'cancel' },
              { 
                text: 'Giriş Yap', 
                onPress: () => router.replace('/auth/login') 
              }
            ]
          );
        } else if (error.message.includes('Password should be at least 6 characters')) {
          Alert.alert('Hata', 'Şifre en az 6 karakter olmalıdır.');
        } else {
          Alert.alert('Hata', error.message);
        }
        return;
      }

      // Başarılı kayıt
      Alert.alert(
        'Kayıt Başarılı!',
        'Hesabınız oluşturuldu. E-posta adresinizi kontrol ederek hesabınızı onaylayın.',
        [
          {
            text: 'Tamam',
            onPress: () => router.replace('/auth/login'),
          },
        ]
      );
    } catch (error) {
      Alert.alert('Hata', 'Kayıt yapılamadı. Lütfen tekrar deneyin.');
      console.error('Register error:', error);
    } finally {
      setLoading(false);
    }
  };

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
            <Text style={styles.headerTitle}>Kayıt Ol</Text>
          </View>

          <View style={styles.formContainer}>
            <View style={styles.welcomeSection}>
              <Text style={styles.welcomeTitle}>Hesap Oluşturun</Text>
              <Text style={styles.welcomeSubtitle}>
                Kişisel astroloji yolculuğunuza başlamak için kayıt olun
              </Text>
            </View>

            {/* Full Name Input */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Ad Soyad</Text>
              <View style={styles.inputContainer}>
                <User size={20} color="#8B5CF6" style={styles.inputIcon} />
                <TextInput
                  style={styles.textInput}
                  value={fullName}
                  onChangeText={setFullName}
                  placeholder="Ad ve soyadınızı girin"
                  placeholderTextColor="#64748B"
                  autoCapitalize="words"
                />
              </View>
            </View>

            {/* Email Input */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>E-posta</Text>
              <View style={styles.inputContainer}>
                <Mail size={20} color="#8B5CF6" style={styles.inputIcon} />
                <TextInput
                  style={styles.textInput}
                  value={email}
                  onChangeText={setEmail}
                  placeholder="E-posta adresinizi girin"
                  placeholderTextColor="#64748B"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                />
              </View>
            </View>

            {/* Phone Input */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Telefon (İsteğe Bağlı)</Text>
              <View style={styles.inputContainer}>
                <Phone size={20} color="#8B5CF6" style={styles.inputIcon} />
                <TextInput
                  style={styles.textInput}
                  value={phone}
                  onChangeText={setPhone}
                  placeholder="+90 5XX XXX XX XX"
                  placeholderTextColor="#64748B"
                  keyboardType="phone-pad"
                  autoCapitalize="none"
                />
              </View>
            </View>

            {/* Password Input */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Şifre</Text>
              <View style={styles.inputContainer}>
                <Lock size={20} color="#8B5CF6" style={styles.inputIcon} />
                <TextInput
                  style={styles.textInput}
                  value={password}
                  onChangeText={setPassword}
                  placeholder="Şifrenizi girin (min. 6 karakter)"
                  placeholderTextColor="#64748B"
                  secureTextEntry={!showPassword}
                  autoCapitalize="none"
                />
                <TouchableOpacity 
                  style={styles.eyeButton}
                  onPress={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff size={20} color="#64748B" />
                  ) : (
                    <Eye size={20} color="#64748B" />
                  )}
                </TouchableOpacity>
              </View>
            </View>

            {/* Confirm Password Input */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Şifre Tekrar</Text>
              <View style={styles.inputContainer}>
                <Lock size={20} color="#8B5CF6" style={styles.inputIcon} />
                <TextInput
                  style={styles.textInput}
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  placeholder="Şifrenizi tekrar girin"
                  placeholderTextColor="#64748B"
                  secureTextEntry={!showConfirmPassword}
                  autoCapitalize="none"
                />
                <TouchableOpacity 
                  style={styles.eyeButton}
                  onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? (
                    <EyeOff size={20} color="#64748B" />
                  ) : (
                    <Eye size={20} color="#64748B" />
                  )}
                </TouchableOpacity>
              </View>
            </View>

            {/* Register Button */}
            <TouchableOpacity
              style={[styles.registerButton, loading && styles.registerButtonDisabled]}
              onPress={handleRegister}
              disabled={loading}
            >
              <Text style={styles.registerButtonText}>
                {loading ? 'Kayıt Yapılıyor...' : 'Kayıt Ol'}
              </Text>
            </TouchableOpacity>

            {/* Login Link */}
            <View style={styles.loginSection}>
              <Text style={styles.loginText}>Zaten hesabınız var mı? </Text>
              <TouchableOpacity onPress={() => router.push('/auth/login')}>
                <Text style={styles.loginLink}>Giriş Yapın</Text>
              </TouchableOpacity>
            </View>
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
  formContainer: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  welcomeSection: {
    marginBottom: 32,
    alignItems: 'center',
  },
  welcomeTitle: {
    fontSize: 28,
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
    marginBottom: 8,
    textAlign: 'center',
  },
  welcomeSubtitle: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#CBD5E1',
    textAlign: 'center',
    lineHeight: 22,
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
  inputIcon: {
    marginRight: 12,
  },
  textInput: {
    flex: 1,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#FFFFFF',
  },
  eyeButton: {
    padding: 4,
  },
  registerButton: {
    backgroundColor: '#8B5CF6',
    paddingVertical: 18,
    borderRadius: 12,
    marginTop: 12,
    shadowColor: '#8B5CF6',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 8,
  },
  registerButtonDisabled: {
    backgroundColor: '#64748B',
    shadowOpacity: 0,
  },
  registerButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    textAlign: 'center',
  },
  loginSection: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 24,
  },
  loginText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#CBD5E1',
  },
  loginLink: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#8B5CF6',
  },
});