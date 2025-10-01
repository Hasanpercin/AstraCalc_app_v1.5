import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useAuth } from '../../hooks/useAuth';
import FormInput from '../../components/FormInput';
import { ValidationService } from '../../utils/validation';
import { Star, ArrowLeft } from 'lucide-react-native';

export default function ForgotPasswordScreen() {
  const router = useRouter();
  const { resetPassword } = useAuth();
  
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [emailSent, setEmailSent] = useState(false);

  const validateForm = (): boolean => {
    const newErrors: { [key: string]: string } = {};

    // Email validation
    if (!email) {
      newErrors.email = 'E-posta adresi gerekli';
    } else if (!ValidationService.validateEmail(email)) {
      newErrors.email = 'Geçerli bir e-posta adresi girin';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleResetPassword = async () => {
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    
    try {
      console.log('🔐 Attempting password reset for:', email);
      
      const result = await resetPassword(email);
      
      if (result.error) {
        console.error('❌ Password reset error:', result.error);
        Alert.alert(
          'Hata', 
          result.error.message || 'Şifre sıfırlama bağlantısı gönderilemedi.'
        );
      } else {
        console.log('✅ Password reset email sent');
        setEmailSent(true);
        Alert.alert(
          'Başarılı!', 
          'Şifre sıfırlama bağlantısı e-posta adresinize gönderildi. Lütfen e-posta kutunuzu kontrol edin.',
          [
            {
              text: 'Tamam',
              onPress: () => router.back()
            }
          ]
        );
      }
    } catch (error) {
      console.error('❌ Password reset exception:', error);
      Alert.alert('Hata', 'Beklenmeyen bir hata oluştu.');
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
        style={styles.keyboardAvoid}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView 
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => router.back()}
            >
              <ArrowLeft size={24} color="#8B5CF6" />
            </TouchableOpacity>
            
            <View style={styles.logoContainer}>
              <View style={styles.iconCircle}>
                <Star size={40} color="#8B5CF6" />
              </View>
              <Text style={styles.title}>Şifremi Unuttum</Text>
              <Text style={styles.subtitle}>
                {emailSent 
                  ? 'E-posta gönderildi! Lütfen gelen kutunuzu kontrol edin.'
                  : 'E-posta adresinizi girin, size şifre sıfırlama bağlantısı gönderelim'}
              </Text>
            </View>
          </View>

          {/* Form */}
          {!emailSent && (
            <View style={styles.form}>
              {/* Email Input */}
              <FormInput
                label="E-posta Adresi"
                value={email}
                onChangeText={setEmail}
                placeholder="ornek@email.com"
                keyboardType="email-address"
                autoCapitalize="none"
                autoComplete="email"
                error={errors.email}
              />

              {/* Reset Password Button */}
              <TouchableOpacity
                style={[styles.resetButton, loading && styles.buttonDisabled]}
                onPress={handleResetPassword}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator size="small" color="#FFFFFF" />
                ) : (
                  <Text style={styles.resetButtonText}>Şifre Sıfırlama Bağlantısı Gönder</Text>
                )}
              </TouchableOpacity>

              {/* Back to Login Link */}
              <View style={styles.loginContainer}>
                <Text style={styles.loginText}>Şifrenizi hatırladınız mı? </Text>
                <TouchableOpacity onPress={() => router.back()}>
                  <Text style={styles.loginLink}>Giriş Yap</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}

          {/* Success Message */}
          {emailSent && (
            <View style={styles.successContainer}>
              <View style={styles.successIcon}>
                <Star size={48} color="#10B981" fill="#10B981" />
              </View>
              <Text style={styles.successTitle}>E-posta Gönderildi!</Text>
              <Text style={styles.successMessage}>
                {email} adresine şifre sıfırlama bağlantısı gönderdik.
                {'\n\n'}
                E-posta gelmezse spam klasörünüzü kontrol etmeyi unutmayın.
              </Text>
              <TouchableOpacity
                style={styles.backToLoginButton}
                onPress={() => router.back()}
              >
                <Text style={styles.backToLoginText}>Giriş Sayfasına Dön</Text>
              </TouchableOpacity>
            </View>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardAvoid: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingVertical: 40,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 40,
  },
  backButton: {
    alignSelf: 'flex-start',
    padding: 8,
    marginBottom: 24,
  },
  logoContainer: {
    alignItems: 'center',
  },
  iconCircle: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: 'rgba(139, 92, 246, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 28,
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
    marginTop: 16,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#94A3B8',
    textAlign: 'center',
    paddingHorizontal: 20,
    lineHeight: 24,
  },
  form: {
    paddingHorizontal: 20,
    gap: 20,
  },
  resetButton: {
    backgroundColor: '#8B5CF6',
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 24,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: 12,
    shadowColor: '#8B5CF6',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 8,
  },
  buttonDisabled: {
    backgroundColor: '#64748B',
    shadowOpacity: 0,
    elevation: 0,
  },
  resetButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF',
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 24,
  },
  loginText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#94A3B8',
  },
  loginLink: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#8B5CF6',
  },
  successContainer: {
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  successIcon: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: 'rgba(16, 185, 129, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  successTitle: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: '#10B981',
    marginBottom: 16,
  },
  successMessage: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#94A3B8',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 32,
  },
  backToLoginButton: {
    backgroundColor: '#8B5CF6',
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 32,
    shadowColor: '#8B5CF6',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 8,
  },
  backToLoginText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF',
  },
});
