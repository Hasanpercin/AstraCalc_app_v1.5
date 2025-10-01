-- Migration: Create Zodiac Tables for AstroCalc (Updated)
-- Description: Creates zodiac_signs, zodiac_daily_predictions, and zodiac_compatibility tables
-- The existing daily_horoscopes table (user comments) will remain untouched
-- Created: 2025-09-30

-- =============================================
-- 1. Zodiac Signs Table (Burçlar) - MAIN TABLE
-- =============================================

CREATE TABLE IF NOT EXISTS public.zodiac_signs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(50) NOT NULL UNIQUE, -- Türkçe burç adı (Koç, Boğa, vb.)
  english_name VARCHAR(50) NOT NULL, -- İngilizce adı (Aries, Taurus, vb.)
  symbol VARCHAR(10) NOT NULL, -- Emoji sembolü (♈, ♉, vb.)
  element VARCHAR(20) NOT NULL CHECK (element IN ('Ateş', 'Toprak', 'Hava', 'Su')),
  quality VARCHAR(20) CHECK (quality IN ('Öncü', 'Sabit', 'Değişken')),
  date_range VARCHAR(50) NOT NULL, -- "21 Mart - 19 Nisan"
  start_day INT NOT NULL CHECK (start_day BETWEEN 1 AND 31),
  start_month INT NOT NULL CHECK (start_month BETWEEN 1 AND 12),
  end_day INT NOT NULL CHECK (end_day BETWEEN 1 AND 31),
  end_month INT NOT NULL CHECK (end_month BETWEEN 1 AND 12),
  
  -- Özellikler
  traits_positive TEXT[], -- ["Cesur", "Enerjik", "Girişken"]
  traits_negative TEXT[], -- ["Aceleci", "Sabırsız", "Agresif"]
  keywords TEXT[], -- Anahtar kelimeler
  
  -- Detaylar
  ruling_planet VARCHAR(50), -- Yönetici gezegen (Mars, Venüs, vb.)
  gemstone VARCHAR(100), -- Şanslı taş
  lucky_numbers INT[], -- Şanslı sayılar
  lucky_colors TEXT[], -- Şanslı renkler
  lucky_day VARCHAR(20), -- Şanslı gün
  
  -- Uyumluluk
  compatibility_high TEXT[], -- Yüksek uyumlu burçlar
  compatibility_low TEXT[], -- Düşük uyumlu burçlar
  
  -- Açıklamalar
  description TEXT, -- Kısa açıklama
  detailed_description TEXT, -- Detaylı açıklama
  love_description TEXT, -- Aşk hayatı
  career_description TEXT, -- Kariyer
  health_description TEXT, -- Sağlık
  
  -- Metadata
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Index for fast lookup
CREATE INDEX IF NOT EXISTS idx_zodiac_signs_name ON public.zodiac_signs(name);
CREATE INDEX IF NOT EXISTS idx_zodiac_signs_element ON public.zodiac_signs(element);

-- =============================================
-- 2. Zodiac Daily Predictions Table (AI Günlük Burç Yorumları)
-- =============================================

CREATE TABLE IF NOT EXISTS public.zodiac_daily_predictions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  zodiac_sign_id UUID NOT NULL REFERENCES public.zodiac_signs(id) ON DELETE CASCADE,
  prediction_date DATE NOT NULL, -- Yorum tarihi
  
  -- Yorumlar
  general_fortune TEXT NOT NULL, -- Genel yorum
  love_fortune TEXT, -- Aşk hayatı
  career_fortune TEXT, -- Kariyer
  health_fortune TEXT, -- Sağlık
  money_fortune TEXT, -- Para
  
  -- Günlük öneriler
  lucky_number INT, -- Günün şanslı sayısı
  lucky_color VARCHAR(50), -- Günün şanslı rengi
  lucky_hour VARCHAR(20), -- Şanslı saat aralığı (örn: "14:00-16:00")
  mood_score INT CHECK (mood_score BETWEEN 1 AND 10), -- Ruh hali skoru (1-10)
  
  -- AI tarafından oluşturuldu mu?
  is_ai_generated BOOLEAN DEFAULT TRUE,
  ai_model VARCHAR(50), -- Kullanılan model (örn: "gpt-4")
  
  -- Metadata
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  
  -- Her burç için günde 1 yorum
  UNIQUE(zodiac_sign_id, prediction_date)
);

-- Indexes for fast queries
CREATE INDEX IF NOT EXISTS idx_zodiac_daily_predictions_zodiac ON public.zodiac_daily_predictions(zodiac_sign_id);
CREATE INDEX IF NOT EXISTS idx_zodiac_daily_predictions_date ON public.zodiac_daily_predictions(prediction_date);
CREATE INDEX IF NOT EXISTS idx_zodiac_daily_predictions_zodiac_date ON public.zodiac_daily_predictions(zodiac_sign_id, prediction_date);

-- =============================================
-- 3. Zodiac Compatibility Table (Burç Uyumluluğu)
-- =============================================

CREATE TABLE IF NOT EXISTS public.zodiac_compatibility (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  zodiac_sign_1_id UUID NOT NULL REFERENCES public.zodiac_signs(id) ON DELETE CASCADE,
  zodiac_sign_2_id UUID NOT NULL REFERENCES public.zodiac_signs(id) ON DELETE CASCADE,
  
  -- Uyumluluk skorları (0-100)
  overall_score INT CHECK (overall_score BETWEEN 0 AND 100),
  love_score INT CHECK (love_score BETWEEN 0 AND 100),
  friendship_score INT CHECK (friendship_score BETWEEN 0 AND 100),
  work_score INT CHECK (work_score BETWEEN 0 AND 100),
  
  -- Açıklamalar
  strengths TEXT[], -- Güçlü yönler
  challenges TEXT[], -- Zorluklar
  advice TEXT, -- İlişki tavsiyeleri
  
  -- Metadata
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  
  -- Her burç çifti için 1 kayıt (sıra önemli değil)
  UNIQUE(zodiac_sign_1_id, zodiac_sign_2_id),
  CHECK (zodiac_sign_1_id != zodiac_sign_2_id)
);

-- Index for bidirectional lookup
CREATE INDEX IF NOT EXISTS idx_zodiac_compat_sign1 ON public.zodiac_compatibility(zodiac_sign_1_id);
CREATE INDEX IF NOT EXISTS idx_zodiac_compat_sign2 ON public.zodiac_compatibility(zodiac_sign_2_id);

-- =============================================
-- 4. Updated At Trigger Function
-- =============================================

CREATE OR REPLACE FUNCTION update_zodiac_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply trigger to all tables
DROP TRIGGER IF EXISTS update_zodiac_signs_updated_at ON public.zodiac_signs;
CREATE TRIGGER update_zodiac_signs_updated_at
  BEFORE UPDATE ON public.zodiac_signs
  FOR EACH ROW
  EXECUTE FUNCTION update_zodiac_updated_at_column();

DROP TRIGGER IF EXISTS update_zodiac_daily_predictions_updated_at ON public.zodiac_daily_predictions;
CREATE TRIGGER update_zodiac_daily_predictions_updated_at
  BEFORE UPDATE ON public.zodiac_daily_predictions
  FOR EACH ROW
  EXECUTE FUNCTION update_zodiac_updated_at_column();

DROP TRIGGER IF EXISTS update_zodiac_compatibility_updated_at ON public.zodiac_compatibility;
CREATE TRIGGER update_zodiac_compatibility_updated_at
  BEFORE UPDATE ON public.zodiac_compatibility
  FOR EACH ROW
  EXECUTE FUNCTION update_zodiac_updated_at_column();

-- =============================================
-- 5. Row Level Security (RLS) Policies
-- =============================================

-- Enable RLS
ALTER TABLE public.zodiac_signs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.zodiac_daily_predictions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.zodiac_compatibility ENABLE ROW LEVEL SECURITY;

-- Zodiac Signs: Public read access
DROP POLICY IF EXISTS "Zodiac signs are viewable by everyone" ON public.zodiac_signs;
CREATE POLICY "Zodiac signs are viewable by everyone"
  ON public.zodiac_signs FOR SELECT
  USING (true);

-- Daily Predictions: Public read access
DROP POLICY IF EXISTS "Daily predictions are viewable by everyone" ON public.zodiac_daily_predictions;
CREATE POLICY "Daily predictions are viewable by everyone"
  ON public.zodiac_daily_predictions FOR SELECT
  USING (true);

-- Zodiac Compatibility: Public read access
DROP POLICY IF EXISTS "Zodiac compatibility is viewable by everyone" ON public.zodiac_compatibility;
CREATE POLICY "Zodiac compatibility is viewable by everyone"
  ON public.zodiac_compatibility FOR SELECT
  USING (true);

-- =============================================
-- 6. Helper Functions
-- =============================================

-- Function to get zodiac sign by date
CREATE OR REPLACE FUNCTION get_zodiac_sign_by_date(birth_date DATE)
RETURNS TABLE(
  id UUID,
  name VARCHAR,
  symbol VARCHAR,
  element VARCHAR
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    zs.id,
    zs.name,
    zs.symbol,
    zs.element
  FROM public.zodiac_signs zs
  WHERE 
    (
      -- Normal case: start_month < end_month
      (zs.start_month < zs.end_month AND
       ((EXTRACT(MONTH FROM birth_date) = zs.start_month AND EXTRACT(DAY FROM birth_date) >= zs.start_day) OR
        (EXTRACT(MONTH FROM birth_date) = zs.end_month AND EXTRACT(DAY FROM birth_date) <= zs.end_day) OR
        (EXTRACT(MONTH FROM birth_date) > zs.start_month AND EXTRACT(MONTH FROM birth_date) < zs.end_month)))
      OR
      -- Wrap around case: Capricorn/Oğlak (Dec 22 - Jan 19)
      (zs.start_month > zs.end_month AND
       ((EXTRACT(MONTH FROM birth_date) = zs.start_month AND EXTRACT(DAY FROM birth_date) >= zs.start_day) OR
        (EXTRACT(MONTH FROM birth_date) = zs.end_month AND EXTRACT(DAY FROM birth_date) <= zs.end_day) OR
        (EXTRACT(MONTH FROM birth_date) > zs.start_month OR EXTRACT(MONTH FROM birth_date) < zs.end_month)))
    )
  LIMIT 1;
END;
$$ LANGUAGE plpgsql STABLE;

-- Function to get today's prediction for a zodiac sign
CREATE OR REPLACE FUNCTION get_todays_prediction(zodiac_name VARCHAR)
RETURNS TABLE(
  general_fortune TEXT,
  love_fortune TEXT,
  career_fortune TEXT,
  health_fortune TEXT,
  lucky_number INT,
  lucky_color VARCHAR
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    zdp.general_fortune,
    zdp.love_fortune,
    zdp.career_fortune,
    zdp.health_fortune,
    zdp.lucky_number,
    zdp.lucky_color
  FROM public.zodiac_daily_predictions zdp
  JOIN public.zodiac_signs zs ON zdp.zodiac_sign_id = zs.id
  WHERE zs.name = zodiac_name
    AND zdp.prediction_date = CURRENT_DATE
  LIMIT 1;
END;
$$ LANGUAGE plpgsql STABLE;

-- =============================================
-- 7. Comments for Documentation
-- =============================================

COMMENT ON TABLE public.zodiac_signs IS 'Stores information about the 12 zodiac signs';
COMMENT ON TABLE public.zodiac_daily_predictions IS 'AI-generated daily horoscope predictions for each zodiac sign';
COMMENT ON TABLE public.zodiac_compatibility IS 'Compatibility scores between zodiac sign pairs';

COMMENT ON FUNCTION get_zodiac_sign_by_date IS 'Returns zodiac sign for a given birth date';
COMMENT ON FUNCTION get_todays_prediction IS 'Returns todays AI prediction for a specific zodiac sign';

-- Migration complete!
-- Note: The existing 'daily_horoscopes' table (user comments) remains unchanged
