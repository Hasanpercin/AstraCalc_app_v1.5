// Global type declarations for libraries without proper TypeScript support
declare module 'react-native-svg' {
  export * from 'react-native-svg/lib/typescript/index';
}

declare module 'lucide-react-native' {
  import { ComponentType } from 'react';
  import { SvgProps } from 'react-native-svg';
  
  export interface IconProps extends SvgProps {
    size?: number;
    color?: string;
    strokeWidth?: number;
  }
  
  export const ArrowLeft: ComponentType<IconProps>;
  export const Star: ComponentType<IconProps>;
  export const Calendar: ComponentType<IconProps>;
  export const Heart: ComponentType<IconProps>;
  export const TrendingUp: ComponentType<IconProps>;
  export const Chrome: ComponentType<IconProps>;
  export const Home: ComponentType<IconProps>;
  export const FileText: ComponentType<IconProps>;
  export const Sparkles: ComponentType<IconProps>;
  export const Settings: ComponentType<IconProps>;
  export const Circle: ComponentType<IconProps>;
  export const Sun: ComponentType<IconProps>;
  export const Bell: ComponentType<IconProps>;
  export const Plus: ComponentType<IconProps>;
  export const RefreshCw: ComponentType<IconProps>;
  export const Moon: ComponentType<IconProps>;
  export const User: ComponentType<IconProps>;
  export const Clock: ComponentType<IconProps>;
  export const Download: ComponentType<IconProps>;
  export const Send: ComponentType<IconProps>;
  export const Bot: ComponentType<IconProps>;
  export const Trash2: ComponentType<IconProps>;
  export const MessageSquare: ComponentType<IconProps>;
  export const HelpCircle: ComponentType<IconProps>;
  export const Info: ComponentType<IconProps>;
  export const LogOut: ComponentType<IconProps>;
  export const ChevronRight: ComponentType<IconProps>;
  export const BarChart3: ComponentType<IconProps>;
}

declare module '@expo-google-fonts/inter' {
  export const useFonts: any;
  export const Inter_400Regular: any;
  export const Inter_500Medium: any;
  export const Inter_600SemiBold: any;
  export const Inter_700Bold: any;
}

declare module 'expo-splash-screen' {
  export const preventAutoHideAsync: () => Promise<boolean>;
  export const hideAsync: () => Promise<boolean>;
}

declare module 'expo-router' {
  export * from '@react-navigation/native';
  export const Stack: any;
  export const Tabs: any;
  export const Link: any;
  export const useRouter: () => any;
  export const useLocalSearchParams: () => any;
}

declare module '@react-navigation/material-top-tabs' {
  export const createMaterialTopTabNavigator: () => any;
}