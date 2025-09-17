import { Tabs } from 'expo-router';
import { Home, FileText, Sparkles, Settings, Circle, Sun } from 'lucide-react-native';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#1E1B4B',
          borderTopColor: '#334155',
          borderTopWidth: 1,
          height: 88,
          paddingTop: 8,
          paddingBottom: 32,
        },
        tabBarActiveTintColor: '#8B5CF6',
        tabBarInactiveTintColor: '#94A3B8',
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '500',
        },
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Ana Sayfa',
          tabBarIcon: ({ size, color }) => (
            <Home size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="birth-chart"
        options={{
          title: 'Doğum Haritası',
          tabBarIcon: ({ size, color }) => (
            <Circle size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="daily-horoscope"
        options={{
          title: 'Günlük Yorum',
          tabBarIcon: ({ size, color }) => (
            <Sun size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="reports"
        options={{
          title: 'Raporlar',
          tabBarIcon: ({ size, color }) => (
            <FileText size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="ai"
        options={{
          title: 'AI Chat',
          tabBarIcon: ({ size, color }) => (
            <Sparkles size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Ayarlar',
          tabBarIcon: ({ size, color }) => (
            <Settings size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}