export interface ZodiacSign {
  id: string;
  name: string;
  symbol: string;
  element: 'Ateş' | 'Toprak' | 'Hava' | 'Su';
  dates: string;
  description: string;
  traits: {
    positive: string[];
    negative: string[];
  };
  compatibility: string[];
  luckyNumbers: number[];
  luckyColors: string[];
  planet?: string;
  gemstone?: string;
  bodyPart?: string;
}

export interface ZodiacData {
  [key: string]: ZodiacSign;
}

export interface DailyZodiacHoroscope {
  id: string;
  zodiacSign: string;
  date: string;
  generalFortune: string;
  loveFortune: string;
  careerFortune: string;
  healthFortune: string;
  luckyColor: string;
  luckyNumber: number;
  compatibility: string;
  advice: string;
  createdAt: string;
}

export interface ZodiacCompatibility {
  sign1: string;
  sign2: string;
  compatibilityScore: number;
  description: string;
  strengths: string[];
  challenges: string[];
}

export interface ZodiacElement {
  name: 'Ateş' | 'Toprak' | 'Hava' | 'Su';
  signs: string[];
  characteristics: string[];
  compatibility: {
    best: string[];
    challenging: string[];
  };
}

export const ZODIAC_SIGNS = [
  'Koç', 'Boğa', 'İkizler', 'Yengeç', 'Aslan', 'Başak',
  'Terazi', 'Akrep', 'Yay', 'Oğlak', 'Kova', 'Balık'
] as const;

export type ZodiacSignName = typeof ZODIAC_SIGNS[number];