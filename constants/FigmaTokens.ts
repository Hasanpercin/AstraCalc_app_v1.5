// Figma Design Tokens - Extracted from Astroloji Mobil Uygulama
export const FigmaTokens = {
  colors: {
    // Primary Colors
    background: '#141221', // Dark background
    surface: '#141221',    // Card background
    primary: '#6147e5',    // Primary purple
    secondary: '#9e94c7',  // Light purple/gray
    text: '#ffffff',       // White text
    textSecondary: '#9e94c7', // Secondary text
    
    // Semantic Colors
    white: '#ffffff',
    dark: '#141221',
    purple: '#6147e5',
    lightPurple: '#9e94c7',
  },
  
  typography: {
    // Based on Space Grotesk font family
    fontFamily: {
      primary: 'Space Grotesk',
      fallback: 'Inter', // iOS/Android fallback
    },
    
    // Font sizes from Figma
    fontSize: {
      title: 18,      // Burçlar title
      subtitle: 16,   // Zodiac names  
      body: 14,       // Date ranges
      caption: 12,    // Small text
    },
    
    // Font weights
    fontWeight: {
      regular: '400' as const,
      medium: '500' as const, 
      semiBold: '600' as const,
      bold: '700' as const,
    },
    
    // Line heights
    lineHeight: {
      tight: 1.2,
      normal: 1.4,
      loose: 1.6,
    },
  },
  
  spacing: {
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 20,
    xxl: 24,
    xxxl: 32,
  },
  
  borderRadius: {
    sm: 8,
    md: 12,
    lg: 16,
    xl: 20,
  },
  
  // Component specific styles from Figma
  components: {
    zodiacCard: {
      backgroundColor: '#141221',
      borderColor: 'rgba(158, 148, 199, 0.2)', // Light purple with opacity
      borderRadius: 16,
      padding: 16,
      minHeight: 120,
    },
    
    zodiacTitle: {
      fontSize: 18,
      fontWeight: '700',
      color: '#ffffff',
      fontFamily: 'Space Grotesk',
    },
    
    zodiacName: {
      fontSize: 16,
      fontWeight: '500', 
      color: '#ffffff',
      fontFamily: 'Space Grotesk',
    },
    
    zodiacDate: {
      fontSize: 14,
      fontWeight: '400',
      color: '#9e94c7',
      fontFamily: 'Space Grotesk',
    },
  },
};
