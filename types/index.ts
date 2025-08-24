export interface UserProfile {
  id: string;
  user_id: string;
  full_name: string;
  email: string;
  created_at: string;
  updated_at: string;
}

export interface BirthData {
  id: string;
  user_id: string;
  full_name: string;
  birth_date: string;
  birth_time: string;
  birth_place: string;
  latitude?: number;
  longitude?: number;
  timezone?: string;
  created_at: string;
  updated_at: string;
}

export interface AstrologyInterpretation {
  id: string;
  user_id: string;
  sun_sign?: string;
  moon_sign?: string;
  rising_sign?: string;
  interpretation?: string;
  raw_response?: string;
  created_at: string;
  updated_at: string;
}

export interface AstrologyReport {
  id: string;
  user_id: string;
  report_type: 'daily' | 'weekly' | 'monthly' | 'yearly' | 'compatibility' | 'birth_chart';
  title: string;
  content: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  created_at: string;
  updated_at: string;
}

export interface WebhookResponse {
  success: boolean;
  message: string;
  sunSign?: string;
  moonSign?: string;
  risingSign?: string;
  interpretation?: string;
  'Güneş Burcu'?: string;
  'Ay Burcu'?: string;
  'Yükselen Burç'?: string;
  'Doğum haritası yorumu'?: string;
  data?: {
    birth_chart?: any;
    planetary_positions?: any;
    houses?: any;
    [key: string]: any;
  };
  error?: string;
}

export interface NatalChartData {
  id: string;
  user_id: string;
  sun_sign: string;
  moon_sign: string;
  rising_sign: string;
  planetary_positions: PlanetaryPosition[];
  houses: HouseData[];
  interpretation: string;
  compatibility_notes?: string;
  created_at: string;
}

export interface PlanetaryPosition {
  planet: string;
  sign: string;
  degree: number;
  house: number;
  retrograde?: boolean;
}

export interface HouseData {
  house_number: number;
  sign: string;
  degree: number;
  ruler: string;
  description: string;
}