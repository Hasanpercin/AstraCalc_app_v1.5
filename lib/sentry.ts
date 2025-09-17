import * as Sentry from '@sentry/react-native';

// Sentry configuration for AstroCalc
Sentry.init({
  dsn: process.env.EXPO_PUBLIC_SENTRY_DSN || '',
  debug: __DEV__,
  environment: __DEV__ ? 'development' : 'production',
  
  // Performance monitoring
  tracesSampleRate: 1.0,
  
  // Session tracking
  enableAutoSessionTracking: true,
  
  // Native crashes
  enableNative: true,
  enableNativeNagger: false,
  
  // Astrology-specific context
  beforeSend(event) {
    // Add astrology context to all events
    if (event.contexts) {
      event.contexts.astrology = {
        app_section: 'unknown',
        birth_chart_loaded: false,
        user_authenticated: false,
      };
    }
    return event;
  },

  // Custom tags for AstroCalc
  initialScope: {
    tags: {
      component: 'astro_calc',
      platform: 'react_native_expo',
    },
  },
});

// Custom error tracking functions for AstroCalc
export const trackAstrologyError = (error: Error, context: {
  section: 'birth_chart' | 'horoscope' | 'ai_chat' | 'auth' | 'profile';
  user_id?: string;
  birth_data?: boolean;
  action?: string;
}) => {
  Sentry.withScope((scope) => {
    scope.setTag('astrology_section', context.section);
    scope.setContext('astrology_context', context);
    
    if (context.user_id) {
      scope.setUser({ id: context.user_id });
    }
    
    Sentry.captureException(error);
  });
};

export const trackPerformance = (name: string, duration: number) => {
  Sentry.addBreadcrumb({
    message: `Performance: ${name}`,
    data: { duration },
    level: 'info',
    category: 'performance',
  });
};

export const trackUserAction = (action: string, data?: any) => {
  Sentry.addBreadcrumb({
    message: `User Action: ${action}`,
    data,
    level: 'info',
    category: 'user',
  });
};

export default Sentry;
