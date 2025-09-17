// src/navigation/AppNavigator.tsx
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ZodiacStackParamList } from '../types/zodiac';

import ZodiacListPage from '../screens/ZodiacListPage';
import ZodiacDetailPage from '../screens/ZodiacDetailPage';
import DailyHoroscopePage from '../screens/DailyHoroscopePage';

const Stack = createNativeStackNavigator<ZodiacStackParamList>();

const AppNavigator: React.FC = () => {
  return (
    <NavigationContainer>
      {/* @ts-ignore */}
      <Stack.Navigator
        initialRouteName="ZodiacList"
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: '#0A092D' },
        }}
      >
      <Stack.Screen 
        name="ZodiacList" 
        component={ZodiacListPage}
        options={{ title: 'Burçlar' }}
      />
      <Stack.Screen 
        name="ZodiacDetail" 
        component={ZodiacDetailPage}
        options={{ title: 'Burç Detayı' }}
      />
      <Stack.Screen 
        name="DailyHoroscope" 
        component={DailyHoroscopePage}
        options={{ title: 'Günlük Yorum' }}
      />
    </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;