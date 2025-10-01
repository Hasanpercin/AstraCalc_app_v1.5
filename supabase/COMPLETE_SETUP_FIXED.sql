-- =============================================
-- COMPLETE ZODIAC SETUP FOR ASTRO CALC (FIXED)
-- Adapts to existing zodiac_signs table with INTEGER id
-- Run this entire script in Supabase SQL Editor
-- =============================================

-- =============================================
-- STEP 1: Extend Existing zodiac_signs Table
-- =============================================

-- Add missing columns to existing zodiac_signs table
ALTER TABLE public.zodiac_signs 
  ADD COLUMN IF NOT EXISTS english_name VARCHAR(50),
  ADD COLUMN IF NOT EXISTS start_day INT,
  ADD COLUMN IF NOT EXISTS start_month INT,
  ADD COLUMN IF NOT EXISTS end_day INT,
  ADD COLUMN IF NOT EXISTS end_month INT,
  ADD COLUMN IF NOT EXISTS traits_positive TEXT[],
  ADD COLUMN IF NOT EXISTS traits_negative TEXT[],
  ADD COLUMN IF NOT EXISTS gemstone VARCHAR(100),
  ADD COLUMN IF NOT EXISTS lucky_numbers INT[],
  ADD COLUMN IF NOT EXISTS lucky_colors TEXT[],
  ADD COLUMN IF NOT EXISTS lucky_day VARCHAR(20),
  ADD COLUMN IF NOT EXISTS compatibility_high TEXT[],
  ADD COLUMN IF NOT EXISTS compatibility_low TEXT[],
  ADD COLUMN IF NOT EXISTS description TEXT,
  ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT TRUE,
  ADD COLUMN IF NOT EXISTS created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP;

-- Add indexes
CREATE INDEX IF NOT EXISTS idx_zodiac_signs_name ON public.zodiac_signs(name);
CREATE INDEX IF NOT EXISTS idx_zodiac_signs_element ON public.zodiac_signs(element);

-- =============================================
-- STEP 2: Create Daily Predictions Table
-- =============================================

CREATE TABLE IF NOT EXISTS public.zodiac_daily_predictions (
  id SERIAL PRIMARY KEY,
  zodiac_sign_id INT NOT NULL REFERENCES public.zodiac_signs(id) ON DELETE CASCADE,
  prediction_date DATE NOT NULL,
  general_fortune TEXT NOT NULL,
  love_fortune TEXT,
  career_fortune TEXT,
  health_fortune TEXT,
  money_fortune TEXT,
  lucky_number INT,
  lucky_color VARCHAR(50),
  lucky_hour VARCHAR(20),
  mood_score INT CHECK (mood_score BETWEEN 1 AND 10),
  is_ai_generated BOOLEAN DEFAULT TRUE,
  ai_model VARCHAR(50),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(zodiac_sign_id, prediction_date)
);

CREATE INDEX IF NOT EXISTS idx_zodiac_daily_predictions_zodiac ON public.zodiac_daily_predictions(zodiac_sign_id);
CREATE INDEX IF NOT EXISTS idx_zodiac_daily_predictions_date ON public.zodiac_daily_predictions(prediction_date);

-- =============================================
-- STEP 3: Create Compatibility Table
-- =============================================

CREATE TABLE IF NOT EXISTS public.zodiac_compatibility (
  id SERIAL PRIMARY KEY,
  zodiac_sign_1_id INT NOT NULL REFERENCES public.zodiac_signs(id) ON DELETE CASCADE,
  zodiac_sign_2_id INT NOT NULL REFERENCES public.zodiac_signs(id) ON DELETE CASCADE,
  overall_score INT CHECK (overall_score BETWEEN 0 AND 100),
  love_score INT CHECK (love_score BETWEEN 0 AND 100),
  friendship_score INT CHECK (friendship_score BETWEEN 0 AND 100),
  work_score INT CHECK (work_score BETWEEN 0 AND 100),
  strengths TEXT[],
  challenges TEXT[],
  advice TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(zodiac_sign_1_id, zodiac_sign_2_id),
  CHECK (zodiac_sign_1_id != zodiac_sign_2_id)
);

CREATE INDEX IF NOT EXISTS idx_zodiac_compat_sign1 ON public.zodiac_compatibility(zodiac_sign_1_id);
CREATE INDEX IF NOT EXISTS idx_zodiac_compat_sign2 ON public.zodiac_compatibility(zodiac_sign_2_id);

-- =============================================
-- STEP 4: Triggers & Functions
-- =============================================

CREATE OR REPLACE FUNCTION update_zodiac_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_zodiac_signs_updated_at ON public.zodiac_signs;
CREATE TRIGGER update_zodiac_signs_updated_at
  BEFORE UPDATE ON public.zodiac_signs
  FOR EACH ROW EXECUTE FUNCTION update_zodiac_updated_at_column();

DROP TRIGGER IF EXISTS update_zodiac_daily_predictions_updated_at ON public.zodiac_daily_predictions;
CREATE TRIGGER update_zodiac_daily_predictions_updated_at
  BEFORE UPDATE ON public.zodiac_daily_predictions
  FOR EACH ROW EXECUTE FUNCTION update_zodiac_updated_at_column();

DROP TRIGGER IF EXISTS update_zodiac_compatibility_updated_at ON public.zodiac_compatibility;
CREATE TRIGGER update_zodiac_compatibility_updated_at
  BEFORE UPDATE ON public.zodiac_compatibility
  FOR EACH ROW EXECUTE FUNCTION update_zodiac_updated_at_column();

-- =============================================
-- STEP 5: RLS Policies
-- =============================================

ALTER TABLE public.zodiac_signs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.zodiac_daily_predictions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.zodiac_compatibility ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public read zodiac_signs" ON public.zodiac_signs;
CREATE POLICY "Public read zodiac_signs" ON public.zodiac_signs FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public read zodiac_daily_predictions" ON public.zodiac_daily_predictions;
CREATE POLICY "Public read zodiac_daily_predictions" ON public.zodiac_daily_predictions FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public read zodiac_compatibility" ON public.zodiac_compatibility;
CREATE POLICY "Public read zodiac_compatibility" ON public.zodiac_compatibility FOR SELECT USING (true);

-- =============================================
-- STEP 6: Helper Functions
-- =============================================

CREATE OR REPLACE FUNCTION get_zodiac_sign_by_date(birth_date DATE)
RETURNS TABLE(id INT, name TEXT, symbol TEXT, element TEXT) AS $$
BEGIN
  RETURN QUERY
  SELECT zs.id, zs.name, zs.symbol, zs.element
  FROM public.zodiac_signs zs
  WHERE 
    (zs.start_month < zs.end_month AND
     ((EXTRACT(MONTH FROM birth_date) = zs.start_month AND EXTRACT(DAY FROM birth_date) >= zs.start_day) OR
      (EXTRACT(MONTH FROM birth_date) = zs.end_month AND EXTRACT(DAY FROM birth_date) <= zs.end_day) OR
      (EXTRACT(MONTH FROM birth_date) > zs.start_month AND EXTRACT(MONTH FROM birth_date) < zs.end_month)))
    OR
    (zs.start_month > zs.end_month AND
     ((EXTRACT(MONTH FROM birth_date) = zs.start_month AND EXTRACT(DAY FROM birth_date) >= zs.start_day) OR
      (EXTRACT(MONTH FROM birth_date) = zs.end_month AND EXTRACT(DAY FROM birth_date) <= zs.end_day) OR
      (EXTRACT(MONTH FROM birth_date) > zs.start_month OR EXTRACT(MONTH FROM birth_date) < zs.end_month)))
  LIMIT 1;
END;
$$ LANGUAGE plpgsql STABLE;

CREATE OR REPLACE FUNCTION get_todays_prediction(zodiac_name TEXT)
RETURNS TABLE(general_fortune TEXT, love_fortune TEXT, career_fortune TEXT, health_fortune TEXT, lucky_number INT, lucky_color VARCHAR) AS $$
BEGIN
  RETURN QUERY
  SELECT zdp.general_fortune, zdp.love_fortune, zdp.career_fortune, zdp.health_fortune, zdp.lucky_number, zdp.lucky_color
  FROM public.zodiac_daily_predictions zdp
  JOIN public.zodiac_signs zs ON zdp.zodiac_sign_id = zs.id
  WHERE zs.name = zodiac_name AND zdp.prediction_date = CURRENT_DATE
  LIMIT 1;
END;
$$ LANGUAGE plpgsql STABLE;

-- =============================================
-- STEP 7: Update Existing Zodiac Data (12 Burç)
-- =============================================

-- Update Koç (Aries) - id: 1
UPDATE public.zodiac_signs SET
  english_name = 'Aries',
  start_day = 21, start_month = 3, end_day = 19, end_month = 4,
  traits_positive = ARRAY['Cesur', 'Enerjik', 'Girişken', 'Özgüvenli', 'Tutkulu', 'Bağımsız'],
  traits_negative = ARRAY['Aceleci', 'Sabırsız', 'Agresif', 'İnatçı', 'Dürtüsel'],
  gemstone = 'Elmas, Kırmızı Akik',
  lucky_numbers = ARRAY[1, 9, 10],
  lucky_colors = ARRAY['Kırmızı', 'Turuncu', 'Beyaz'],
  lucky_day = 'Salı',
  compatibility_high = ARRAY['Aslan', 'Yay', 'İkizler', 'Kova'],
  compatibility_low = ARRAY['Yengeç', 'Terazi', 'Oğlak'],
  description = 'Lider ruhlu, cesur ve enerjik. Her zaman öncü olmak ister.'
WHERE name = 'Koç';

-- Update Boğa (Taurus) - id: 2
UPDATE public.zodiac_signs SET
  english_name = 'Taurus',
  start_day = 20, start_month = 4, end_day = 20, end_month = 5,
  traits_positive = ARRAY['Güvenilir', 'Sadık', 'Pratik', 'Sabırlı', 'Kararlı', 'Sorumlu'],
  traits_negative = ARRAY['İnatçı', 'Maddiyatçı', 'Değişime Dirençli', 'Possesif'],
  gemstone = 'Zümrüt, Safir',
  lucky_numbers = ARRAY[2, 6, 15],
  lucky_colors = ARRAY['Yeşil', 'Pembe', 'Turkuaz'],
  lucky_day = 'Cuma',
  compatibility_high = ARRAY['Başak', 'Oğlak', 'Yengeç', 'Balık'],
  compatibility_low = ARRAY['Aslan', 'Kova', 'Akrep'],
  description = 'Güvenilir, sabırlı ve pratik. Güzelliğe ve konfora düşkün.'
WHERE name = 'Boğa';

-- Update İkizler (Gemini) - id: 3
UPDATE public.zodiac_signs SET
  english_name = 'Gemini',
  start_day = 21, start_month = 5, end_day = 20, end_month = 6,
  traits_positive = ARRAY['Zeki', 'İletişim Yeteneği Güçlü', 'Uyumlu', 'Meraklı', 'Esprili', 'Sosyal'],
  traits_negative = ARRAY['Kararsız', 'Yüzeysel', 'Tutarsız', 'Gergin', 'Dağınık'],
  gemstone = 'Akuamarin, Sitrin',
  lucky_numbers = ARRAY[3, 5, 23],
  lucky_colors = ARRAY['Sarı', 'Turuncu', 'Açık Mavi'],
  lucky_day = 'Çarşamba',
  compatibility_high = ARRAY['Terazi', 'Kova', 'Koç', 'Aslan'],
  compatibility_low = ARRAY['Başak', 'Balık', 'Yay'],
  description = 'Zeki, konuşkan ve meraklı. İletişim yeteneği çok güçlü.'
WHERE name = 'İkizler';

-- Update Yengeç (Cancer) - id: 4
UPDATE public.zodiac_signs SET
  english_name = 'Cancer',
  start_day = 21, start_month = 6, end_day = 22, end_month = 7,
  traits_positive = ARRAY['Şefkatli', 'Koruyucu', 'Duygusal', 'Sadık', 'Empatik', 'Aile Odaklı'],
  traits_negative = ARRAY['Aşırı Hassas', 'Çabuk Kırılan', 'Geçmişe Takılı', 'Savunmacı', 'Karamsar'],
  gemstone = 'İnci, Ay Taşı',
  lucky_numbers = ARRAY[2, 7, 11],
  lucky_colors = ARRAY['Beyaz', 'Gümüş', 'Açık Mavi'],
  lucky_day = 'Pazartesi',
  compatibility_high = ARRAY['Akrep', 'Balık', 'Boğa', 'Başak'],
  compatibility_low = ARRAY['Koç', 'Terazi', 'Oğlak'],
  description = 'Duygusal, koruyucu ve şefkatli. Aile ve yuva çok önemli.'
WHERE name = 'Yengeç';

-- Update Aslan (Leo) - id: 5
UPDATE public.zodiac_signs SET
  english_name = 'Leo',
  start_day = 23, start_month = 7, end_day = 22, end_month = 8,
  traits_positive = ARRAY['Özgüvenli', 'Cömert', 'Karizmatik', 'Yaratıcı', 'Cesur', 'Sadık'],
  traits_negative = ARRAY['Kibirli', 'Egosu Yüksek', 'Dikkat Arayışı', 'İnatçı', 'Baskın'],
  gemstone = 'Yakut, Amber',
  lucky_numbers = ARRAY[1, 5, 19],
  lucky_colors = ARRAY['Altın', 'Turuncu', 'Kırmızı'],
  lucky_day = 'Pazar',
  compatibility_high = ARRAY['Koç', 'Yay', 'İkizler', 'Terazi'],
  compatibility_low = ARRAY['Boğa', 'Akrep', 'Kova'],
  description = 'Karizmatik, cömert ve özgüvenli. Her zaman parlak olmak ister.'
WHERE name = 'Aslan';

-- Update Başak (Virgo) - id: 6
UPDATE public.zodiac_signs SET
  english_name = 'Virgo',
  start_day = 23, start_month = 8, end_day = 22, end_month = 9,
  traits_positive = ARRAY['Analitik', 'Detaycı', 'Pratik', 'Çalışkan', 'Mütevazı', 'Yardımsever'],
  traits_negative = ARRAY['Aşırı Eleştirel', 'Mükemmeliyetçi', 'Endişeli', 'Sıkı', 'Güvensiz'],
  gemstone = 'Safir, Peridot',
  lucky_numbers = ARRAY[5, 14, 23],
  lucky_colors = ARRAY['Yeşil', 'Kahverengi', 'Beyaz'],
  lucky_day = 'Çarşamba',
  compatibility_high = ARRAY['Boğa', 'Oğlak', 'Yengeç', 'Akrep'],
  compatibility_low = ARRAY['Yay', 'İkizler', 'Balık'],
  description = 'Analitik, detaycı ve pratik. Mükemmelliyetçi yapıya sahip.'
WHERE name = 'Başak';

-- Update Terazi (Libra) - id: 7
UPDATE public.zodiac_signs SET
  english_name = 'Libra',
  start_day = 23, start_month = 9, end_day = 22, end_month = 10,
  traits_positive = ARRAY['Diplomatik', 'Adil', 'Sosyal', 'Zarif', 'Romantik', 'Uyumlu'],
  traits_negative = ARRAY['Kararsız', 'Çatışmadan Kaçınan', 'Yüzeysel', 'Bağımlı', 'Kayıtsız'],
  gemstone = 'Opal, Lapis Lazuli',
  lucky_numbers = ARRAY[6, 15, 24],
  lucky_colors = ARRAY['Pembe', 'Açık Mavi', 'Yeşil'],
  lucky_day = 'Cuma',
  compatibility_high = ARRAY['İkizler', 'Kova', 'Aslan', 'Yay'],
  compatibility_low = ARRAY['Yengeç', 'Oğlak', 'Koç'],
  description = 'Dengeli, adil ve diplomatik. İlişkilere büyük önem verir.'
WHERE name = 'Terazi';

-- Update Akrep (Scorpio) - id: 8
UPDATE public.zodiac_signs SET
  english_name = 'Scorpio',
  start_day = 23, start_month = 10, end_day = 21, end_month = 11,
  traits_positive = ARRAY['Tutkulu', 'Kararlı', 'Sadık', 'Güçlü', 'Stratejik', 'Derin'],
  traits_negative = ARRAY['Kıskanç', 'Sahiplenici', 'Gizli', 'İntikamcı', 'Manipülatif'],
  gemstone = 'Topaz, Akuamarin',
  lucky_numbers = ARRAY[8, 11, 18],
  lucky_colors = ARRAY['Bordo', 'Siyah', 'Kırmızı'],
  lucky_day = 'Salı',
  compatibility_high = ARRAY['Yengeç', 'Balık', 'Başak', 'Oğlak'],
  compatibility_low = ARRAY['Aslan', 'Kova', 'Boğa'],
  description = 'Yoğun, tutkulu ve kararlı. Derin duygusal bir yapıya sahip.'
WHERE name = 'Akrep';

-- Update Yay (Sagittarius) - id: 9
UPDATE public.zodiac_signs SET
  english_name = 'Sagittarius',
  start_day = 22, start_month = 11, end_day = 21, end_month = 12,
  traits_positive = ARRAY['İyimser', 'Özgür', 'Maceraperest', 'Dürüst', 'Felsefi', 'Entelektüel'],
  traits_negative = ARRAY['Sorumsuz', 'Taktik', 'Düşüncesiz', 'Sabırsız', 'Aşırı Dürüst'],
  gemstone = 'Turkuaz, Ametist',
  lucky_numbers = ARRAY[3, 12, 21],
  lucky_colors = ARRAY['Mor', 'Mavi', 'Kırmızı'],
  lucky_day = 'Perşembe',
  compatibility_high = ARRAY['Koç', 'Aslan', 'Terazi', 'Kova'],
  compatibility_low = ARRAY['Başak', 'Balık', 'İkizler'],
  description = 'İyimser, özgür ve maceraperest. Öğrenmeye ve keşfetmeye aç.'
WHERE name = 'Yay';

-- Update Oğlak (Capricorn) - id: 10
UPDATE public.zodiac_signs SET
  english_name = 'Capricorn',
  start_day = 22, start_month = 12, end_day = 19, end_month = 1,
  traits_positive = ARRAY['Disiplinli', 'Sorumlu', 'Çalışkan', 'Hırslı', 'Sabırlı', 'Pratik'],
  traits_negative = ARRAY['Katı', 'Kötümser', 'İnatçı', 'Soğuk', 'Baskıcı'],
  gemstone = 'Granat, Oniks',
  lucky_numbers = ARRAY[4, 8, 13],
  lucky_colors = ARRAY['Siyah', 'Gri', 'Kahverengi'],
  lucky_day = 'Cumartesi',
  compatibility_high = ARRAY['Boğa', 'Başak', 'Akrep', 'Balık'],
  compatibility_low = ARRAY['Koç', 'Terazi', 'Yengeç'],
  description = 'Disiplinli, sorumlu ve hırslı. Başarıya odaklı bir yapıya sahip.'
WHERE name = 'Oğlak';

-- Update Kova (Aquarius) - id: 11
UPDATE public.zodiac_signs SET
  english_name = 'Aquarius',
  start_day = 20, start_month = 1, end_day = 18, end_month = 2,
  traits_positive = ARRAY['Özgün', 'İnsancıl', 'Bağımsız', 'Entelektüel', 'Yaratıcı', 'Vizyoner'],
  traits_negative = ARRAY['Duygusuz', 'İnatçı', 'Uzak', 'Öngörülemez', 'İsyankâr'],
  gemstone = 'Ametist, Akuamarin',
  lucky_numbers = ARRAY[4, 7, 22],
  lucky_colors = ARRAY['Turkuaz', 'Gümüş', 'Mor'],
  lucky_day = 'Cumartesi',
  compatibility_high = ARRAY['İkizler', 'Terazi', 'Koç', 'Yay'],
  compatibility_low = ARRAY['Boğa', 'Aslan', 'Akrep'],
  description = 'Özgün, bağımsız ve vizyoner. İnsanlığa hizmet etmek ister.'
WHERE name = 'Kova';

-- Update Balık (Pisces) - id: 12
UPDATE public.zodiac_signs SET
  english_name = 'Pisces',
  start_day = 19, start_month = 2, end_day = 20, end_month = 3,
  traits_positive = ARRAY['Empatik', 'Şefkatli', 'Sanatçı', 'Sezgisel', 'Duygusal', 'Hayalperest'],
  traits_negative = ARRAY['Aşırı Hassas', 'Kaçışçı', 'Kararsız', 'Kurban', 'Melankolik'],
  gemstone = 'Akuamarin, Ametist',
  lucky_numbers = ARRAY[3, 7, 12],
  lucky_colors = ARRAY['Deniz Yeşili', 'Mor', 'Gümüş'],
  lucky_day = 'Perşembe',
  compatibility_high = ARRAY['Yengeç', 'Akrep', 'Boğa', 'Oğlak'],
  compatibility_low = ARRAY['İkizler', 'Yay', 'Başak'],
  description = 'Empatik, şefkatli ve sanatçı ruhlu. Derin bir hayal dünyası var.'
WHERE name = 'Balık';

-- Verify
SELECT 
  id, name, english_name, symbol, 
  start_month, end_month, 
  lucky_numbers, lucky_colors
FROM public.zodiac_signs 
ORDER BY id;
