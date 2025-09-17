import React from 'react';
import { View, Text } from 'react-native';
import { useRouter } from 'expo-router';
import { useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { LinearGradient } from 'expo-linear-gradient';

export default function IndexScreen() {
  const router = useRouter();
  const { user, loading } = useAuth();

  useEffect(() => {
    const handleNavigation = async () => {
      if (!loading) {
        if (user) {
          // Kullanıcı varsa tabs sayfasına yönlendir
          router.push('/(tabs)');
        } else {
          // Kullanıcı yoksa welcome sayfasına yönlendir
          router.push('/welcome');
        }
      }
    };
    
    handleNavigation();
  }, [user, loading]);

  // Show loading screen while checking auth
  if (loading) {
    return (
      <LinearGradient
        colors={['#1E1B4B', '#312E81', '#4C1D95']}
        style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
      >
        <Text style={{ color: '#FFFFFF', fontSize: 18, fontFamily: 'Inter-Regular' }}>
          Yükleniyor...
        </Text>
      </LinearGradient>
    );
  }

  return null;
}