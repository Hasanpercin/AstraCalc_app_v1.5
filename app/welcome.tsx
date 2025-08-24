import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { Star } from 'lucide-react-native';

import { useAuth } from '../hooks/useAuth';

const { width, height } = Dimensions.get('window');

export default function WelcomeScreen() {
  const router = useRouter();
  const { user, loading } = useAuth();

  // Redirect if user is already authenticated
  React.useEffect(() => {
    if (user && !loading) {
      router.replace('/(tabs)');
    }
  }, [user, loading]);

  if (loading) {
    return (
      <LinearGradient
        colors={['#1E1B4B', '#312E81', '#4C1D95']}
        style={styles.container}
      >
        <View style={styles.content}>
          <Text style={styles.subtitle}>Yükleniyor...</Text>
        </View>
      </LinearGradient>
    );
  }

  if (user) {
    return null; // Will redirect
  }

  return (
    <LinearGradient
      colors={['#1E1B4B', '#312E81', '#4C1D95']}
      style={styles.container}
    >
      <View style={styles.content}>
        <View style={styles.starContainer}>
          <Star size={80} color="#8B5CF6" fill="#8B5CF6" />
        </View>
        
        <Text style={styles.title}>Astrocalc</Text>
        <Text style={styles.subtitle}>Kişisel astroloji rehberiniz</Text>
        
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.primaryButton}
            onPress={() => router.push('/auth/register')}
          >
            <Text style={styles.primaryButtonText}>Hesap Oluştur</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={() => router.push('/auth/login')}
          >
            <Text style={styles.secondaryButtonText}>Giriş Yap</Text>
          </TouchableOpacity>
        </View>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: width,
    height: height,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  starContainer: {
    marginBottom: 40,
    shadowColor: '#8B5CF6',
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.3,
    shadowRadius: 20,
  },
  title: {
    fontSize: 42,
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
    marginBottom: 12,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 18,
    fontFamily: 'Inter-Regular',
    color: '#CBD5E1',
    textAlign: 'center',
    marginBottom: 60,
    lineHeight: 24,
  },
  buttonContainer: {
    width: '100%',
    gap: 16,
  },
  primaryButton: {
    backgroundColor: '#8B5CF6',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 12,
    width: '100%',
    shadowColor: '#8B5CF6',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 8,
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    textAlign: 'center',
  },
  secondaryButton: {
    backgroundColor: 'transparent',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 12,
    width: '100%',
    borderWidth: 2,
    borderColor: '#4338CA',
  },
  secondaryButtonText: {
    color: '#8B5CF6',
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    textAlign: 'center',
  },
});