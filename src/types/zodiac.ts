// src/types/zodiac.ts

// zodiac_signs tablosu için
export interface ZodiacSign {
  id: number;
  name: string;
  symbol: string;
  date_range: string;
  ruling_planet: string;
  element: string;
  quality: string;
  keywords: string[];
}

// daily_horoscopes tablosu için
export interface DailyHoroscope {
  id: number;
  sign_id: number;
  date: string; // YYYY-MM-DD formatında
  general_overview: string;
  love_commentary: string;
  career_commentary: string;
  health_commentary: string;
}

// Navigasyon için tip tanımlamaları
export type ZodiacStackParamList = {
  ZodiacList: undefined;
  ZodiacDetail: { sign: ZodiacSign };
  DailyHoroscope: { sign: ZodiacSign };
};

// Grid card props için
export interface ZodiacGridCardProps {
  sign: ZodiacSign;
  onPress: () => void;
}

// Sekme navigasyonu için
export type HoroscopeTabParamList = {
  General: { horoscope: DailyHoroscope | null };
  Love: { horoscope: DailyHoroscope | null };
  Career: { horoscope: DailyHoroscope | null };
  Health: { horoscope: DailyHoroscope | null };
};