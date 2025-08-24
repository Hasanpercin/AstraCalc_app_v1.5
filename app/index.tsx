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
    if (!loading) {
      if (user) {
        router.replace('/(tabs)');
      } else {
        router.replace('/welcome');
      }
    }
  });

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